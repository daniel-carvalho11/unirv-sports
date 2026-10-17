import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Request, Sse } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { MatchLiveService } from './live/match-live.service';
import { MatchClockDto, MatchLiveEventDto, MatchScoreDto } from './live/match-live.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('matches')
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly matchLiveService: MatchLiveService,
  ) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(createMatchDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.matchesService.findAll();
  }

  // Rotas fixas precisam vir antes de ':id', senão o ParseIntPipe tenta converter "live"/"officiating"

  // Server-Sent Events: placar ao vivo para home/dashboard sem precisar de polling
  @Public()
  @Sse('live/stream')
  liveStream() {
    return this.matchLiveService.stream();
  }

  @Roles(UserRole.TABLE_OFFICIAL)
  @Get('officiating')
  findOfficiating(@Request() req) {
    return this.matchLiveService.findOfficiating(req.user.id);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.matchLiveService.findLive(id);
  }

  @Roles(UserRole.TABLE_OFFICIAL)
  @Post(':id/clock')
  clock(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() dto: MatchClockDto) {
    return this.matchLiveService.clock(id, req.user, dto.action);
  }

  @Roles(UserRole.TABLE_OFFICIAL)
  @Post(':id/score')
  score(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() dto: MatchScoreDto) {
    return this.matchLiveService.score(id, req.user, dto);
  }

  @Roles(UserRole.TABLE_OFFICIAL)
  @Post(':id/events')
  registerEvent(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() dto: MatchLiveEventDto) {
    return this.matchLiveService.registerEvent(id, req.user, dto);
  }

  @Roles(UserRole.TABLE_OFFICIAL)
  @Post(':id/sets/close')
  closeSet(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.matchLiveService.closeSet(id, req.user);
  }

  // Edição livre da partida (datas, equipes, mesário) fica só com o ADMIN; a mesa usa as rotas acima
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    return this.matchesService.update(id, updateMatchDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.matchesService.remove(id);
  }
}
