import { IsString, IsBoolean, IsNumber, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  storeID: string;

  @IsString()
  @IsNotEmpty()
  storeName: string;

  @IsBoolean()
  takeOutInStore: boolean;

  @IsNumber()
  shippingTimeInDays: number;

  @IsString()
  latitude: string;

  @IsString()
  longitude: string;

  @IsString()
  address1: string;

  @IsOptional()
  @IsString()
  address2?: string;

  @IsOptional()
  @IsString()
  address3?: string;

  @IsString()
  city: string;

  @IsString()
  district: string;

  @IsString()
  state: string;

  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  postalCode: string;

  @IsOptional()
  @IsString()
  telephoneNumber?: string;

  @IsOptional()
  @IsEmail()
  emailAddress?: string;
}

export class UpdateStoreDto extends CreateStoreDto {}
