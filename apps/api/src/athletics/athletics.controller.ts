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
import { UserRole } from '@prisma/client';
import { AthleticsService } from './athletics.service';
import { CreateAthleticDto } from './dto/create-athletics.dto';
import { UpdateAthleticDto } from './dto/update-athletics.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('athletics')
export class AthleticsController {
  constructor(private readonly athleticsService: AthleticsService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createAthleticDto: CreateAthleticDto) {
    return this.athleticsService.create(createAthleticDto);
  }

  // Listagem pública: usada no cadastro (seleção de atlética) e na home
  @Public()
  @Get()
  findAll() {
    return this.athleticsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.athleticsService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAthleticDto: UpdateAthleticDto,
  ) {
    return this.athleticsService.update(id, updateAthleticDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.athleticsService.remove(id);
  }
}
