import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AthleticsService } from './athletics.service';
import { CreateAthleticDto } from './dto/create-athletics.dto';
import { UpdateAthleticDto } from './dto/update-athletics.dto';

@Controller('athletics')
export class AthleticsController {
  constructor(private readonly athleticsService: AthleticsService) {}

  @Post()
  create(@Body() createAthleticDto: CreateAthleticDto) {
    return this.athleticsService.create(createAthleticDto);
  }

  @Get()
  findAll() {
    return this.athleticsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.athleticsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAthleticDto: UpdateAthleticDto,
  ) {
    return this.athleticsService.update(id, updateAthleticDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.athleticsService.remove(id);
  }
}