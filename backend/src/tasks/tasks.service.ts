import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Task, TaskStatus } from './tasks.model';
import { User, UserRole } from '../users/users.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task) private taskModel: typeof Task,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(actor: User, dto: CreateTaskDto) {
    const task = await this.taskModel.create({
      ...dto,
      createdById: actor.id,
      assignedToId: dto.assignedToId || null,
    } as any);

    this.eventEmitter.emit('task.created', { actor, task: task.get({ plain: true }) });
    return task;
  }

  async findAll(user: User) {
    const where = user.role === UserRole.ADMIN ? {} : { assignedToId: user.id };
    return this.taskModel.findAll({
      where,
      include: [
        { model: User, as: 'assignedTo' },
        { model: User, as: 'createdBy' },
      ],
    });
  }

  async update(actor: User, id: string, dto: UpdateTaskDto) {
    const task = await this.taskModel.findByPk(id, { include: ['assignedTo', 'createdBy'] });
    if (!task) throw new NotFoundException('Task not found');

    const oldTask = task.get({ plain: true });
    await task.update(dto as any);
    const updatedTask = task.get({ plain: true });

    this.eventEmitter.emit('task.updated', { actor, oldTask, newTask: updatedTask });
    return updatedTask;
  }

  async remove(actor: User, id: string) {
    const task = await this.taskModel.findByPk(id);
    if (!task) throw new NotFoundException('Task not found');

    const oldTask = task.get({ plain: true });
    await task.destroy();

    this.eventEmitter.emit('task.deleted', { actor, taskId: id, oldTask });
  }

  async updateStatus(actor: User, id: string, status: TaskStatus) {
    const task = await this.taskModel.findByPk(id);
    if (!task) throw new NotFoundException('Task not found');

    const oldStatus = task.status;
    await task.update({ status });
    const updated = task.get({ plain: true });

    this.eventEmitter.emit('task.status-changed', {
      actor,
      taskId: id,
      oldStatus,
      newStatus: status,
      task: updated,
    });
    return updated;
  }
}