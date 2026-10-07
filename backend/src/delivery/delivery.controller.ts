import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role, DeliveryStatus } from '@prisma/client';

@ApiTags('Delivery')
@Controller('delivery')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get(':orderId')
  @ApiOperation({ summary: 'Get delivery information for order' })
  async getDeliveryInfo(@Param('orderId') orderId: string) {
    return this.deliveryService.getByOrderId(orderId);
  }

  @Patch(':orderId')
  @Roles(Role.WHOLESALER, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update delivery status / tracking number' })
  async updateDelivery(
    @Param('orderId') orderId: string,
    @Body() body: { trackingNumber?: string; status?: DeliveryStatus },
  ) {
    return this.deliveryService.updateDelivery(orderId, body);
  }
}
