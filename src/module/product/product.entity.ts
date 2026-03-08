import { Table, Column, Model } from 'sequelize-typescript';

@Table({ timestamps: true, deletedAt: true })
export class Product extends Model {
  @Column({ unique: true })
  productToken: string;

  @Column
  name: string;

  @Column
  price: string;

  @Column
  stock: number;
}
