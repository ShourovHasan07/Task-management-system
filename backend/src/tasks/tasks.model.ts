import { 
  Table, 
  Column, 
  Model, 
  DataType, 
  PrimaryKey, 
  Default, 
  CreatedAt, 
  UpdatedAt, 
  ForeignKey, 
  BelongsTo 
} from 'sequelize-typescript';

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
  declare id: string;                   

  @Column({ allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare description: string;

  @Column({ 
    type: DataType.ENUM('PENDING', 'PROCESSING', 'DONE'), 
    defaultValue: TaskStatus.PENDING 
  })
  declare status: TaskStatus;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  declare assignedToId: string | null;

  @BelongsTo(() => User, 'assignedToId')
  declare assignedTo: User | null;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare createdById: string;

  @BelongsTo(() => User, 'createdById')
  declare createdBy: User;

  @CreatedAt
  declare createdAt: Date;              

  @UpdatedAt
  declare updatedAt: Date;              
}