import { Controller, Post, Get, Patch, Body, Param, ParseIntPipe, Request } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationStatusDto } from './dto/update-registration-status.dto';
import { Roles } from '../auth/decorators/roles.decorator';

// JwtAuthGuard e RolesGuard são globais (app.module.ts); aqui só declaramos quais roles acessam cada rota
@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Roles(UserRole.ATHLETE)
  @Post()
  async create(@Request() req, @Body() dto: CreateRegistrationDto) {
    return this.registrationsService.createRequest(req.user.id, dto);
  }

  @Roles(UserRole.ATHLETE)
  @Get('my-requests')
  async getMyRequests(@Request() req) {
    return this.registrationsService.findMyRequests(req.user.id);
  }

  @Roles(UserRole.REPRESENTATIVE)
  @Get('pending')
  async getPending(@Request() req) {
    return this.registrationsService.findPendingByAthletics(req.user.athleticsId);
  }

  @Roles(UserRole.REPRESENTATIVE)
  @Get('athletics')
  async getAllFromMyAthletics(@Request() req) {
    return this.registrationsService.findAllByAthletics(req.user.athleticsId);
  }

  @Roles(UserRole.REPRESENTATIVE)
  @Patch(':id/status')
  async updateStatus(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRegistrationStatusDto,
  ) {
    return this.registrationsService.updateStatus(id, req.user.athleticsId, dto);
  }
}
