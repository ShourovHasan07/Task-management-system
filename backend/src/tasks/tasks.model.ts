import { Table, Column, Model, DataType, PrimaryKey, Default, CreatedAt, UpdatedAt, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../users/users.model';

export enum TaskStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
}

@Table({ tableName: 'tasks', timestamps: true })
export class Task extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({ type: DataType.ENUM('PENDING', 'PROCESSING', 'DONE'), defaultValue: TaskStatus.PENDING })
  status: TaskStatus;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  assignedToId: string | null;

  @BelongsTo(() => User, 'assignedToId')
  assignedTo: User | null;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  createdById: string;

  @BelongsTo(() => User, 'createdById')
  createdBy: User;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}