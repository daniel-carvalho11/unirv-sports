import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { SystemSettingsService } from './system-settings.service';
import { CreateSystemSettingDto } from './dto/create-system-setting.dto';
import { UpdateSystemSettingDto } from './dto/update-system-setting.dto';

@Controller('system-settings')
export class SystemSettingsController {
  constructor(private readonly systemSettingsService: SystemSettingsService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createSystemSettingDto: CreateSystemSettingDto) {
    return this.systemSettingsService.create(createSystemSettingDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.systemSettingsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.systemSettingsService.findOne(+id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSystemSettingDto: UpdateSystemSettingDto) {
    return this.systemSettingsService.update(+id, updateSystemSettingDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.systemSettingsService.remove(+id);
  }
}
