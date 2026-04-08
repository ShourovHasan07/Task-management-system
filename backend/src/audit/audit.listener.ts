import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuditService } from './audit.service';
import { AuditAction } from './audit.model';

@Injectable()
export class AuditListener {
  constructor(private readonly auditService: AuditService) {}

  @OnEvent('task.created')
  async handleTaskCreated(payload: { actor: any; task: any }) {
    await this.auditService.log({
      actorId: payload.actor.id,
      actorEmail: payload.actor.email,
      actionType: AuditAction.CREATE_TASK,
      targetType: 'TASK',
      targetId: payload.task.id,
      oldData: null,
      newData: payload.task,
    });
  }

  @OnEvent('task.updated')
  async handleTaskUpdated(payload: { actor: any; oldTask: any; newTask: any }) {
    await this.auditService.log({
      actorId: payload.actor.id,
      actorEmail: payload.actor.email,
      actionType: AuditAction.UPDATE_TASK,
      targetType: 'TASK',
      targetId: payload.newTask.id,
      oldData: payload.oldTask,
      newData: payload.newTask,
    });
  }

  @OnEvent('task.deleted')
  async handleTaskDeleted(payload: { actor: any; taskId: string; oldTask: any }) {
    await this.auditService.log({
      actorId: payload.actor.id,
      actorEmail: payload.actor.email,
      actionType: AuditAction.DELETE_TASK,
      targetType: 'TASK',
      targetId: payload.taskId,
      oldData: payload.oldTask,
      newData: null,
    });
  }

  @OnEvent('task.status-changed')
  async handleStatusChanged(payload: { actor: any; taskId: string; oldStatus: string; newStatus: string; task: any }) {
    await this.auditService.log({
      actorId: payload.actor.id,
      actorEmail: payload.actor.email,
      actionType: AuditAction.CHANGE_STATUS,
      targetType: 'TASK',
      targetId: payload.taskId,
      oldData: { status: payload.oldStatus },
      newData: { status: payload.newStatus, task: payload.task },
    });
  }

  @OnEvent('task.assignment-changed')
  async handleAssignmentChanged(payload: { actor: any; taskId: string; oldAssignedTo: string | null; newAssignedTo: string | null; task: any }) {
    await this.auditService.log({
      actorId: payload.actor.id,
      actorEmail: payload.actor.email,
      actionType: AuditAction.CHANGE_ASSIGNMENT,
      targetType: 'TASK',
      targetId: payload.taskId,
      oldData: { assignedToId: payload.oldAssignedTo },
      newData: { assignedToId: payload.newAssignedTo, task: payload.task },
    });
  }
}