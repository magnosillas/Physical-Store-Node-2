import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
  Default,
} from 'sequelize-typescript';
import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsNumber } from 'class-validator';

@Table({
  tableName: 'stores',
  timestamps: true, // Adiciona campos createdAt e updatedAt
})
export class Store extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @IsNotEmpty({ message: 'O campo storeID não pode estar vazio.' })
  @IsString({ message: 'O campo storeID deve ser uma string.' })
  storeID: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  @IsNotEmpty({ message: 'O campo storeName não pode estar vazio.' })
  @IsString({ message: 'O campo storeName deve ser uma string.' })
  storeName: string;

  @AllowNull(false)
  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  @IsBoolean({ message: 'O campo takeOutInStore deve ser um booleano.' })
  takeOutInStore: boolean;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  @IsNotEmpty({ message: 'O campo shippingTimeInDays não pode estar vazio.' })
  @IsNumber({}, { message: 'O campo shippingTimeInDays deve ser um número.' })
  shippingTimeInDays: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  @IsNotEmpty({ message: 'O campo latitude não pode estar vazio.' })
  @IsString({ message: 'O campo latitude deve ser uma string.' })
  latitude: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  @IsNotEmpty({ message: 'O campo longitude não pode estar vazio.' })
  @IsString({ message: 'O campo longitude deve ser uma string.' })
  longitude: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  @IsNotEmpty({ message: 'O campo address1 não pode estar vazio.' })
  @IsString({ message: 'O campo address1 deve ser uma string.' })
  address1: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @IsString({ message: 'O campo address2 deve ser uma string.' })
  address2: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @IsString({ message: 'O campo address3 deve ser uma string.' })
  address3: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  @IsNotEmpty({ message: 'O campo city não pode estar vazio.' })
  @IsString({ message: 'O campo city deve ser uma string.' })
  city: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  @IsNotEmpty({ message: 'O campo district não pode estar vazio.' })
  @IsString({ message: 'O campo district deve ser uma string.' })
  district: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  @IsNotEmpty({ message: 'O campo state não pode estar vazio.' })
  @IsString({ message: 'O campo state deve ser uma string.' })
  state: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  @IsNotEmpty({ message: 'O campo type não pode estar vazio.' })
  @IsString({ message: 'O campo type deve ser uma string.' })
  type: string; // PDV ou LOJA

  @AllowNull(false)
  @Default('Brazil')
  @Column({
    type: DataType.STRING,
  })
  @IsNotEmpty({ message: 'O campo country não pode estar vazio.' })
  @IsString({ message: 'O campo country deve ser uma string.' })
  country: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  @IsNotEmpty({ message: 'O campo postalCode não pode estar vazio.' })
  @IsString({ message: 'O campo postalCode deve ser uma string.' })
  postalCode: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  @IsString({ message: 'O campo telephoneNumber deve ser uma string.' })
  telephoneNumber: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  @IsEmail({}, { message: 'O campo emailAddress deve ser um endereço de email válido.' })
  emailAddress: string;
}
