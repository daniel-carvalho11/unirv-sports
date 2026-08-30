import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { BoardPresidentsService } from './board-presidents.service';
import { CreateBoardPresidentDto } from './dto/create-board-president.dto';
import { UpdateBoardPresidentDto } from './dto/update-board-president.dto';

@Controller('board-presidents')
export class BoardPresidentsController {
  constructor(private readonly boardPresidentsService: BoardPresidentsService) {}

  @Post()
  create(@Body() dto: CreateBoardPresidentDto) {
    return this.boardPresidentsService.create(dto);
  }

  @Get()
  findByAthletics(@Query('athleticsId', ParseIntPipe) athleticsId: number) {
    return this.boardPresidentsService.findByAthletics(athleticsId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.boardPresidentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBoardPresidentDto) {
    return this.boardPresidentsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.boardPresidentsService.remove(id);
  }
}