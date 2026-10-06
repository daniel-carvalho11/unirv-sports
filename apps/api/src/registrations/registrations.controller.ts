import { Controller, Post, Get, Patch, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationStatusDto } from './dto/update-registration-status.dto';

// Nota: Adiciona aqui os teus Guards de autenticação e Roles conforme a tua aplicação (ex: JwtAuthGuard, RolesGuard)
@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateRegistrationDto) {
    return this.registrationsService.createRequest(req.user.id, dto);
  }

  @Get('my-requests')
  async getMyRequests(@Request() req) {
    return this.registrationsService.findMyRequests(req.user.id);
  }

  @Get('pending')
  async getPending(@Request() req) {
    return this.registrationsService.findPendingByAthletics(req.user.athleticsId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRegistrationStatusDto,
  ) {
    return this.registrationsService.updateStatus(id, req.user.athleticsId, dto);
  }
}