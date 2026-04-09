


import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EventEmitterModule } from '@nestjs/event-emitter';   // ← যোগ করো

import { AuditService } from './audit.service';
import { AuditListener } from './audit.listener';
import { AuditLog } from './audit.model';

@Module({
  imports: [
    SequelizeModule.forFeature([AuditLog]),
    // EventEmitterModule.forRoot() টা AppModule-এ আছে, তাই এখানে দরকার নেই
  ],
  providers: [
    AuditService,
    AuditListener,
  ],
  exports: [AuditService],
})
export class AuditModule {}