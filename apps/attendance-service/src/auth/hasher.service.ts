import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HasherService {
  private readonly saltRounds = 10;

  async hash(str: string): Promise<string> {
    return bcrypt.hash(
      str,
      this.saltRounds,
    );
  }

  async compare(
    str: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(str, hash);
  }
}