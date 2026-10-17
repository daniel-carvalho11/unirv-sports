import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RegistrationsService', () => {
  let service: RegistrationsService;
  const prisma = {
    user: { findUnique: jest.fn() },
    sport: { findFirst: jest.fn() },
    athleteSportRegistration: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegistrationsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<RegistrationsService>(RegistrationsService);
  });

  it('recusa inscrição de atleta sem atlética', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, athleticsId: null });
    await expect(service.createRequest(1, { sportId: 1 })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('cria solicitação PENDING vinculada à atlética do atleta', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, athleticsId: 7 });
    prisma.sport.findFirst.mockResolvedValue({ id: 3 });
    prisma.athleteSportRegistration.findUnique.mockResolvedValue(null);
    prisma.athleteSportRegistration.create.mockResolvedValue({ id: 10 });

    await service.createRequest(1, { sportId: 3 });

    expect(prisma.athleteSportRegistration.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: { userId: 1, sportId: 3, athleticsId: 7, status: 'PENDING' } }),
    );
  });

  it('reabre solicitação recusada como PENDING', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, athleticsId: 7 });
    prisma.sport.findFirst.mockResolvedValue({ id: 3 });
    prisma.athleteSportRegistration.findUnique.mockResolvedValue({ id: 10, status: 'REJECTED', deletedAt: null });

    await service.createRequest(1, { sportId: 3 });

    expect(prisma.athleteSportRegistration.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 10 }, data: expect.objectContaining({ status: 'PENDING' }) }),
    );
  });

  it('bloqueia diretor sem atlética de listar pendências', async () => {
    await expect(service.findPendingByAthletics(null)).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.athleteSportRegistration.findMany).not.toHaveBeenCalled();
  });

  it('bloqueia diretor de outra atlética de aprovar', async () => {
    prisma.athleteSportRegistration.findFirst.mockResolvedValue({ id: 10, athleticsId: 2 });
    await expect(service.updateStatus(10, 1, { status: 'APPROVED' })).rejects.toBeInstanceOf(ForbiddenException);
  });
});
