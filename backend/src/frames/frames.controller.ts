import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FramesService } from './frames.service';
import { CreateFrameDto } from './dto/create-frame.dto';
import { UpdateFrameDto } from './dto/update-frame.dto';
import { FrameQueryDto } from './dto/frame-query.dto';

@ApiTags('Frames')
@Controller('frames')
export class FramesController {
  constructor(private readonly framesService: FramesService) {}

  @Get('seed-demo')
  @ApiOperation({ summary: 'Seed sample Oleva OLV1201 wireframe frame model' })
  seedDemo() {
    return this.framesService.seedWireframeExample();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get overall Frame platform statistics' })
  getStats() {
    return this.framesService.getStats();
  }

  @Get()
  @ApiOperation({ summary: 'List and filter frames (single & group modes)' })
  findAll(@Query() query: FrameQueryDto) {
    return this.framesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single frame details by ID' })
  findOne(@Param('id') id: string) {
    return this.framesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new Frame (Single or Group frame)' })
  create(@Body() body: CreateFrameDto, @Req() req: any) {
    const userId = req.user?.id || null;
    return this.framesService.create(userId, body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update frame by ID' })
  update(@Param('id') id: string, @Body() body: UpdateFrameDto) {
    return this.framesService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete frame by ID' })
  remove(@Param('id') id: string) {
    return this.framesService.remove(id);
  }
}
