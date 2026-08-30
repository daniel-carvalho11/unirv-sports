import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSystemSettingDto } from './dto/create-system-setting.dto';
import { UpdateSystemSettingDto } from './dto/update-system-setting.dto';

@Injectable()
export class SystemSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSystemSettingDto) {
    const { targetDate, ...data } = dto;

    return this.prisma.systemSetting.create({
      data: {
        ...data,
        ...(targetDate && { targetDate: new Date(targetDate) }),
      },
    });
  }

  findAll() {
    return this.prisma.systemSetting.findMany({
      where: { deletedAt: null },
    });
  }

  async findOne(id: number) {
    const setting = await this.prisma.systemSetting.findFirst({
      where: { id, deletedAt: null },
    });

    if (!setting) {
      throw new NotFoundException(`Configuração com ID ${id} não encontrada.`);
    }

    return setting;
  }

  async findByKey(key: string) {
    const setting = await this.prisma.systemSetting.findFirst({
      where: { key, deletedAt: null },
    });

    if (!setting) {
      throw new NotFoundException(`Configuração '${key}' não encontrada.`);
    }

    return setting;
  }

  async update(id: number, dto: UpdateSystemSettingDto) {
    await this.findOne(id);
    const { targetDate, ...data } = dto;

    return this.prisma.systemSetting.update({
      where: { id },
      data: {
        ...data,
        ...(targetDate && { targetDate: new Date(targetDate) }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.systemSetting.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}