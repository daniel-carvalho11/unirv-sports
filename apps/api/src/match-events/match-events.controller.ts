import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { MatchEventsService } from './match-events.service';
import { CreateMatchEventDto } from './dto/create-match-event.dto';
import { UpdateMatchEventDto } from './dto/update-match-event.dto';

@Controller('match-events')
export class MatchEventsController {
  constructor(private readonly matchEventsService: MatchEventsService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createMatchEventDto: CreateMatchEventDto) {
    return this.matchEventsService.create(createMatchEventDto);
  }

  @Public()
  @Get()
  findAllByMatch(@Query('matchId', ParseIntPipe) matchId: number) {
    return this.matchEventsService.findAllByMatch(matchId);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.matchEventsService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMatchEventDto: UpdateMatchEventDto,
  ) {
    return this.matchEventsService.update(id, updateMatchEventDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.matchEventsService.remove(id);
  }
}