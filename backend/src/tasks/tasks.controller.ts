import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../users/users.model';
import { TaskStatus } from './tasks.model';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  create(@Request() req, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(req.user, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.tasksService.findAll(req.user);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(req.user, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  remove(@Request() req, @Param('id') id: string) {
    return this.tasksService.remove(req.user, id);
  }

  @Put(':id/status')
  updateStatus(@Request() req, @Param('id') id: string, @Body('status') status: TaskStatus) {
    return this.tasksService.updateStatus(req.user, id, status);
  }
}