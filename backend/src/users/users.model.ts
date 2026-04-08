
import { Table, Column, Model, DataType, PrimaryKey, Default, CreatedAt, UpdatedAt } from 'sequelize-typescript';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ unique: true, allowNull: false })
  email: string;

  @Column({ allowNull: false })
  password: string;

  @Column({ type: DataType.ENUM('ADMIN', 'USER'), allowNull: false })
  role: UserRole;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}