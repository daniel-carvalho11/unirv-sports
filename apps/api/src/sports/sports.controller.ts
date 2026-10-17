import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { SportsService } from './sports.service';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('sports')
export class SportsController {
  constructor(private readonly sportsService: SportsService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  upsert(@Body() createSportDto: CreateSportDto) {
    return this.sportsService.upsert(createSportDto);
  }

  // Listagem pública: usada na home e na aba "Modalidades" do dashboard
  @Public()
  @Get()
  findAll() {
    return this.sportsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sportsService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateSportDto: UpdateSportDto
  ) {
    return this.sportsService.update(id, updateSportDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sportsService.remove(id);
  }
}
