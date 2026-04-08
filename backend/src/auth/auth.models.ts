
import { Table, Column, Model, DataType, PrimaryKey, Default, CreatedAt } from 'sequelize-typescript';

export enum AuditAction {
  CREATE_TASK = 'CREATE_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  DELETE_TASK = 'DELETE_TASK',
  CHANGE_STATUS = 'CHANGE_STATUS',
  CHANGE_ASSIGNMENT = 'CHANGE_ASSIGNMENT',
}

@Table({ tableName: 'audit_logs', timestamps: true })
export class AuditLog extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ allowNull: false })
  actorId: string;

  @Column({ allowNull: false })
  actorEmail: string;

  @Column({ type: DataType.ENUM(...Object.values(AuditAction)), allowNull: false })
  actionType: AuditAction;

  @Column({ allowNull: false })
  targetType: string;

  @Column({ allowNull: false })
  targetId: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  oldData: any;

  @Column({ type: DataType.JSONB, allowNull: true })
  newData: any;

  @CreatedAt
  createdAt: Date;
}