import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Store } from './store.model';
import { CreateStoreDto, UpdateStoreDto } from './store.dto';

@Injectable()
export class StoreService {
  constructor(@InjectModel(Store) private storeRepository: typeof Store) {}

  findAll(): Promise<Store[]> {
    return this.storeRepository.findAll();
  }

  findOneById(id: string): Promise<Store> {
    return this.storeRepository.findByPk(id);
  }

  async create(storeData: CreateStoreDto): Promise<Store> {
    return this.storeRepository.create(storeData);
  }

  async update(id: string, updateData: UpdateStoreDto): Promise<Store> {
    const store = await this.findOneById(id);
    return store.update(updateData);
  }

  async delete(id: string): Promise<void> {
    const store = await this.findOneById(id);
    await store.destroy();
  }
}
