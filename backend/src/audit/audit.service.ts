import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuditLog, AuditAction } from './audit.model';

@Injectable()
export class AuditService {
  constructor(@InjectModel(AuditLog) private auditModel: typeof AuditLog) {}

  async log(data: {
    actorId: string;
    actorEmail: string;
    actionType: AuditAction;
    targetType: string;
    targetId: string;
    oldData: any;
    newData: any;
  }) {
    await this.auditModel.create(data);
  }

  async getAllLogs() {
    return this.auditModel.findAll({ order: [['createdAt', 'DESC']] });
  }
}