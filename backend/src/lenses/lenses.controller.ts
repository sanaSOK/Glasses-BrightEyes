import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { LensesService } from './lenses.service';
import {
  CreateBrandDto,
  CreateLensProductDto,
  UpdateVariantCellDto,
  BatchUpdateVariantsDto,
  CreateLensOrderDto,
} from './dto/create-lens-product.dto';

@Controller('lenses')
export class LensesController {
  constructor(private readonly lensesService: LensesService) {}

  // -------------------------------------------------------------
  // 1. BRANDS
  // -------------------------------------------------------------
  @Get('brands')
  getBrands() {
    return this.lensesService.getBrands();
  }

  @Post('brands')
  createBrand(@Body() body: CreateBrandDto) {
    return this.lensesService.createBrand(body);
  }

  // -------------------------------------------------------------
  // 2. LENS PRODUCTS MASTER
  // -------------------------------------------------------------
  @Get('products')
  getLensProducts(
    @Query('lensType') lensType?: string,
    @Query('brandId') brandId?: string,
    @Query('search') search?: string,
  ) {
    return this.lensesService.getLensProducts(lensType, brandId, search);
  }

  @Get('products/:id')
  getLensProductById(@Param('id') id: string) {
    return this.lensesService.getLensProductById(id);
  }

  @Post('products')
  createLensProduct(@Body() body: CreateLensProductDto) {
    return this.lensesService.createLensProduct(body);
  }

  @Put('products/:id')
  updateLensProduct(@Param('id') id: string, @Body() body: Partial<CreateLensProductDto>) {
    return this.lensesService.updateLensProduct(id, body);
  }

  @Delete('products/:id')
  deleteLensProduct(@Param('id') id: string) {
    return this.lensesService.deleteLensProduct(id);
  }

  // -------------------------------------------------------------
  // 3. MATRIX VARIANTS UPDATES
  // -------------------------------------------------------------
  @Patch('variants/:id')
  updateVariantCell(@Param('id') id: string, @Body() body: UpdateVariantCellDto) {
    return this.lensesService.updateVariantCell(id, body);
  }

  @Post('variants/batch-update')
  batchUpdateVariants(@Body() body: BatchUpdateVariantsDto) {
    return this.lensesService.batchUpdateVariants(body);
  }

  // -------------------------------------------------------------
  // 4. LENS ORDERS & CHECKOUT
  // -------------------------------------------------------------
  @Post('orders')
  createLensOrder(@Body() body: CreateLensOrderDto) {
    return this.lensesService.createLensOrder(body);
  }

  @Get('orders')
  getLensOrders() {
    return this.lensesService.getLensOrders();
  }

  // -------------------------------------------------------------
  // 5. UNIFIED LENS ORDERS & RX LAB ORDER WIZARD
  // -------------------------------------------------------------
  @Get('unified-orders')
  getUnifiedOrders(@Query() query: any) {
    return this.lensesService.getUnifiedOrders(query);
  }

  @Get('unified-orders/:id')
  getUnifiedOrderById(@Param('id') id: string) {
    return this.lensesService.getUnifiedOrderById(id);
  }

  @Post('unified-orders')
  createUnifiedOrder(@Body() body: any) {
    return this.lensesService.createUnifiedOrder(body);
  }

  @Patch('unified-orders/:id/status')
  updateUnifiedOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.lensesService.updateUnifiedOrderStatus(id, status);
  }

  @Delete('unified-orders/:id')
  deleteUnifiedOrder(@Param('id') id: string) {
    return this.lensesService.deleteUnifiedOrder(id);
  }

  // -------------------------------------------------------------
  // 6. STOCK LENS MATRIX CATALOG
  // -------------------------------------------------------------
  @Get('stock-matrix')
  getStockMatrix(
    @Query('category') category?: string,
    @Query('treatment') treatment?: string,
  ) {
    return this.lensesService.getStockMatrixCatalog(category, treatment);
  }
}

