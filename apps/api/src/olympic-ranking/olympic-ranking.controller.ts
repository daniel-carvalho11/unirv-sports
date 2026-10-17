import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { OlympicRankingService } from './olympic-ranking.service';
import { CreateOlympicRankingDto } from './dto/create-olympic-ranking.dto';
import { UpdateOlympicRankingDto } from './dto/update-olympic-ranking.dto';

@Controller('olympic-ranking')
export class OlympicRankingController {
  constructor(private readonly olympicRankingService: OlympicRankingService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  upsert(@Body() createOlympicRankingDto: CreateOlympicRankingDto) {
    return this.olympicRankingService.upsert(createOlympicRankingDto);
  }

  @Public()
  @Get()
  findByTournament(@Query('tournamentId', ParseIntPipe) tournamentId: number) {
    return this.olympicRankingService.findByTournament(tournamentId);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.olympicRankingService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOlympicRankingDto: UpdateOlympicRankingDto,
  ) {
    return this.olympicRankingService.update(id, updateOlympicRankingDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.olympicRankingService.remove(id);
  }
}