import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
} from 'sequelize-typescript';

export enum AuditAction {
  CREATE_TASK = 'CREATE_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  DELETE_TASK = 'DELETE_TASK',
  CHANGE_STATUS = 'CHANGE_STATUS',
  CHANGE_ASSIGNMENT = 'CHANGE_ASSIGNMENT',
}

@Table({
  tableName: 'audit_logs',
  timestamps: true,
})
export class AuditLog extends Model<AuditLog> {

  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({ allowNull: false })
  declare actorId: string;

  @Column({ allowNull: false })
  declare actorEmail: string;

  @Column({
    type: DataType.ENUM(...Object.values(AuditAction)),
    allowNull: false,
  })
  declare actionType: AuditAction;

  @Column({ allowNull: false })
  declare targetType: string;

  @Column({ allowNull: false })
  declare targetId: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  declare oldData?: Record<string, any>;

  @Column({ type: DataType.JSONB, allowNull: true })
  declare newData?: Record<string, any>;

  @CreatedAt
  declare createdAt: Date;
}