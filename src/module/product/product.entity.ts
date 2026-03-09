import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'products', timestamps: true, deletedAt: true })
export class Product extends Model {
  @Column({ allowNull: false, unique: true })
  productToken: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false, type: DataType.DECIMAL })
  price: string;

  @Column({ allowNull: false, type: DataType.INTEGER })
  stock: number;
}
