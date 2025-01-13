import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from '../dtos/create.dto';
import { UpdateStoreDto } from '../dtos/update.dto';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  findAll() {
    return this.storeService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.storeService.findOneById(id);
  }

  @Post()
  create(@Body() storeData: CreateStoreDto) {
    return this.storeService.create(storeData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: UpdateStoreDto) {
    return this.storeService.update(id, updateData);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.storeService.delete(id);
  }
}
