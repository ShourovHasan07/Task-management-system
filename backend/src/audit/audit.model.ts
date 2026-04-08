import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuditService } from './audit.service';
import { AuditListener } from './audit.listener';
import { AuditLog } from './audit.model';

@Module({
  imports: [SequelizeModule.forFeature([AuditLog])],
  providers: [AuditService, AuditListener],
  exports: [AuditService],
})
export class AuditModule {}