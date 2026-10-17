import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { RegistrationStatus } from '@prisma/client';
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
      throw new BadRequestException('Atleta precisa estar vinculado a uma atlética para se inscrever.');
    }

    const sport = await this.prisma.sport.findFirst({
      where: { id: dto.sportId, deletedAt: null },
    });

    if (!sport) {
      throw new NotFoundException('Modalidade não encontrada.');
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

    // Solicitação recusada pode ser reenviada: reaproveita o registro por causa do @@unique([userId, sportId])
    if (existing && existing.status === RegistrationStatus.REJECTED && !existing.deletedAt) {
      return this.prisma.athleteSportRegistration.update({
        where: { id: existing.id },
        data: {
          status: RegistrationStatus.PENDING,
          athleticsId: user.athleticsId,
          notes: null,
        },
        include: { sport: true },
      });
    }

    if (existing) {
      throw new BadRequestException('Já existe uma solicitação ou inscrição efetuada para esta modalidade.');
    }

    return this.prisma.athleteSportRegistration.create({
      data: {
        userId,
        sportId: dto.sportId,
        athleticsId: user.athleticsId,
        status: RegistrationStatus.PENDING,
      },
      include: {
        sport: true,
      },
    });
  }

  async findMyRequests(userId: number) {
    return this.prisma.athleteSportRegistration.findMany({
      where: { userId, deletedAt: null },
      include: {
        sport: true,
        athletics: {
          select: { id: true, name: true, acronym: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPendingByAthletics(athleticsId: number | null) {
    // Sem atlética, o filtro ficaria undefined e o Prisma retornaria as solicitações de TODAS as atléticas
    this.ensureAthletics(athleticsId);

    return this.prisma.athleteSportRegistration.findMany({
      where: {
        athleticsId: athleticsId!,
        status: RegistrationStatus.PENDING,
        deletedAt: null,
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

  async findAllByAthletics(athleticsId: number | null) {
    this.ensureAthletics(athleticsId);

    return this.prisma.athleteSportRegistration.findMany({
      where: { athleticsId: athleticsId!, deletedAt: null },
      include: {
        user: {
          select: { id: true, name: true, email: true, academicId: true, photoUrl: true },
        },
        sport: true,
      },
      orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
    });
  }

  async updateStatus(
    registrationId: number,
    directorAthleticsId: number | null,
    dto: UpdateRegistrationStatusDto,
  ) {
    this.ensureAthletics(directorAthleticsId);

    const registration = await this.prisma.athleteSportRegistration.findFirst({
      where: { id: registrationId, deletedAt: null },
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
      include: { sport: true },
    });
  }

  private ensureAthletics(athleticsId: number | null | undefined) {
    if (!athleticsId) {
      throw new ForbiddenException('Seu usuário não está vinculado a nenhuma atlética.');
    }
  }
}
