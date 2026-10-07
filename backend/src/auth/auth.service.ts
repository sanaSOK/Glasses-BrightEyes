import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email address is already registered');
    }

    let resolvedRole: Role = Role.RETAILER;
    if (dto.role == 2 || dto.role === '2' || dto.role === 'WHOLESALER') {
      resolvedRole = Role.WHOLESALER;
    } else if (dto.role == 3 || dto.role === '3' || dto.role === 'SUPER_ADMIN') {
      resolvedRole = Role.SUPER_ADMIN;
    } else {
      resolvedRole = Role.RETAILER;
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          password: hashedPassword,
          role: resolvedRole,
        },
      });

      if (resolvedRole === Role.WHOLESALER) {
        const companyName = dto.companyName || `${dto.name} Optical Wholesale`;
        const businessAddress = dto.businessAddress || 'Phnom Penh, Cambodia';
        const province = dto.province || 'Phnom Penh';
        const district = dto.district || 'Chamkar Mon';

        await tx.wholesaler.create({
          data: {
            userId: user.id,
            companyName,
            businessAddress,
            province,
            district,
            phone: dto.phone || '012345678',
            email: dto.email,
          },
        });
      } else if (resolvedRole === Role.RETAILER) {
        const storeName = dto.storeName || `${dto.name} Optical Store`;
        const storeAddress = dto.storeAddress || 'Phnom Penh, Cambodia';
        const province = dto.province || 'Phnom Penh';
        const district = dto.district || 'Toul Kork';

        const retailer = await tx.retailer.create({
          data: {
            userId: user.id,
            storeName,
            storeAddress,
            province,
            district,
            phone: dto.phone || '012345678',
            email: dto.email,
          },
        });

        // Initialize Retailer Cart
        await tx.cart.create({
          data: {
            retailerId: retailer.id,
          },
        });

        // Initialize default Store
        await tx.store.create({
          data: {
            retailerId: retailer.id,
            storeName,
            address: storeAddress,
            province,
            district,
            phone: dto.phone || '012345678',
          },
        });
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);
      const userProfile = await tx.user.findUnique({
        where: { id: user.id },
        include: { wholesaler: true, retailer: true },
      });

      const { password, ...userWithoutPassword } = userProfile;

      return {
        user: userWithoutPassword,
        ...tokens,
      };
    });
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        wholesaler: true,
        retailer: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.active) {
      throw new UnauthorizedException('Your account has been deactivated');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const refreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'super_secret_brighteyes_jwt_refresh_key_2026';

      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: refreshSecret,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { wholesaler: true, retailer: true },
      });

      if (!user || !user.active) {
        throw new UnauthorizedException('Invalid token or user deactivated');
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);
      const { password, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        ...tokens,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        wholesaler: true,
        retailer: {
          include: {
            stores: true,
            cart: {
              include: {
                items: {
                  include: {
                    product: {
                      include: {
                        images: true,
                        inventory: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessTokenSecret =
      this.configService.get<string>('JWT_SECRET') ||
      'super_secret_brighteyes_jwt_access_key_2026';

    const refreshTokenSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      'super_secret_brighteyes_jwt_refresh_key_2026';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessTokenSecret,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshTokenSecret,
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }
}
