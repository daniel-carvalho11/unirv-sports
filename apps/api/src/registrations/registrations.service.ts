import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationStatusDto } from './dto/update-registration-status.dto';

@Injectable()
export class RegistrationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createRequest(userId: number, dto: CreateRegistrationDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.athleticsId) {
      throw new BadRequestException('Atleta precisa de estar vinculado a uma atlética para se inscrever.');
    }

    // Verifica se já existe uma solicitação efetuada para esta modalidade
    const existing = await this.prisma.athleteSportRegistration.findUnique({
      where: {
        userId_sportId: {
          userId,
          sportId: dto.sportId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Já existe uma solicitação ou inscrição efetuada para esta modalidade.');
    }

    return this.prisma.athleteSportRegistration.create({
      data: {
        userId,
        sportId: dto.sportId,
        athleticsId: user.athleticsId,
        status: 'PENDING',
      },
      include: {
        sport: true,
      },
    });
  }

  async findMyRequests(userId: number) {
    return this.prisma.athleteSportRegistration.findMany({
      where: { userId },
      include: {
        sport: true,
        athletics: {
          select: { id: true, name: true, acronym: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPendingByAthletics(athleticsId: number) {
    return this.prisma.athleteSportRegistration.findMany({
      where: {
        athleticsId,
        status: 'PENDING',
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, academicId: true, photoUrl: true },
        },
        sport: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateStatus(
    registrationId: number,
    directorAthleticsId: number,
    dto: UpdateRegistrationStatusDto,
  ) {
    const registration = await this.prisma.athleteSportRegistration.findUnique({
      where: { id: registrationId },
    });

    if (!registration) {
      throw new NotFoundException('Solicitação não encontrada.');
    }

    if (registration.athleticsId !== directorAthleticsId) {
      throw new ForbiddenException('Apenas diretores da mesma atlética podem atualizar esta solicitação.');
    }

    return this.prisma.athleteSportRegistration.update({
      where: { id: registrationId },
      data: {
        status: dto.status,
        notes: dto.notes,
      },
    });
  }
}