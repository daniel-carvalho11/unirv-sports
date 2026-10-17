import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { BoardPresidentsService } from './board-presidents.service';
import { CreateBoardPresidentDto } from './dto/create-board-president.dto';
import { UpdateBoardPresidentDto } from './dto/update-board-president.dto';

@Controller('board-presidents')
export class BoardPresidentsController {
  constructor(private readonly boardPresidentsService: BoardPresidentsService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateBoardPresidentDto) {
    return this.boardPresidentsService.create(dto);
  }

  @Public()
  @Get()
  findByAthletics(@Query('athleticsId', ParseIntPipe) athleticsId: number) {
    return this.boardPresidentsService.findByAthletics(athleticsId);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.boardPresidentsService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBoardPresidentDto) {
    return this.boardPresidentsService.update(id, dto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.boardPresidentsService.remove(id);
  }
}