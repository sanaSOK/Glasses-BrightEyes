import { Module } from '@nestjs/common';
import { LensesService } from './lenses.service';
import { LensesController } from './lenses.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LensesController],
  providers: [LensesService],
  exports: [LensesService],
})
export class LensesModule {}
