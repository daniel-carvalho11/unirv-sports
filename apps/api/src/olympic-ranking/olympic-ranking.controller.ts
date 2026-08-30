import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { OlympicRankingService } from './olympic-ranking.service';
import { CreateOlympicRankingDto } from './dto/create-olympic-ranking.dto';
import { UpdateOlympicRankingDto } from './dto/update-olympic-ranking.dto';

@Controller('olympic-ranking')
export class OlympicRankingController {
  constructor(private readonly olympicRankingService: OlympicRankingService) {}

  @Post()
  upsert(@Body() createOlympicRankingDto: CreateOlympicRankingDto) {
    return this.olympicRankingService.upsert(createOlympicRankingDto);
  }

  @Get()
  findByTournament(@Query('tournamentId', ParseIntPipe) tournamentId: number) {
    return this.olympicRankingService.findByTournament(tournamentId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.olympicRankingService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOlympicRankingDto: UpdateOlympicRankingDto,
  ) {
    return this.olympicRankingService.update(id, updateOlympicRankingDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.olympicRankingService.remove(id);
  }
}