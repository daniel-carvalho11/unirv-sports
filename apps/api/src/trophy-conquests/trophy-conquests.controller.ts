import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { TrophyConquestsService } from './trophy-conquests.service';
import { CreateTrophyConquestDto } from './dto/create-trophy-conquest.dto';
import { UpdateTrophyConquestDto } from './dto/update-trophy-conquest.dto';

@Controller('trophy-conquests')
export class TrophyConquestsController {
  constructor(private readonly trophyConquestsService: TrophyConquestsService) {}

  @Post()
  create(@Body() dto: CreateTrophyConquestDto) {
    return this.trophyConquestsService.create(dto);
  }

  @Get()
  findByAthletics(@Query('athleticsId', ParseIntPipe) athleticsId: number) {
    return this.trophyConquestsService.findByAthletics(athleticsId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.trophyConquestsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTrophyConquestDto) {
    return this.trophyConquestsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.trophyConquestsService.remove(id);
  }
}