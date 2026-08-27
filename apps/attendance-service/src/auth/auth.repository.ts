import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { Auth } from './auth.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Auth)
    private readonly repository: Repository<Auth>,
  ) {}

  async create(auth: Partial<Auth>): Promise<Auth> {
    const entity = this.repository.create(auth);
    return this.repository.save(entity);
  }

  async findById(id: string): Promise<Auth | null> {
    return this.repository.findOne({
      where: {
        id,
        revokedAt: IsNull(),
      },
    });
  }

  async update(
    id: string,
    data: Partial<Auth>,
  ): Promise<Auth | null> {
    const auth = await this.repository.preload({
      id,
      ...data,
    });
    if (!auth) {
      return null;
    }

    return this.repository.save(auth);
  }
}