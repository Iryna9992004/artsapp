import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/domain/entities/user.entity';
import { IUserRepository } from 'src/auth/domain/repos/user.repository';
import { ClickhouseService } from 'src/clickhouse/clickhouse.service';

@Injectable()
export class UserRepositoryClickhouse implements IUserRepository {
  constructor(private readonly clickhouseService: ClickhouseService) {}

  async findByEmail(email: string): Promise<User | null> {
    const connection = this.clickhouseService.getConnectionDetails();
    const rows = await connection.query({
      query: `SELECT * from users WHERE email = {email:String}`,
      query_params: { email },
      format: 'JSON',
    });

    const result = await rows.json();

    if (result.data && result.data.length > 0) {
      return result.data[0] as User;
    }

    return null;
  }

  async findById(id: number): Promise<User | null> {
    const connection = this.clickhouseService.getConnectionDetails();
    const raws = await connection.query({
      query: `SELECT * FROM users WHERE id = {id: number}`,
      query_params: { id },
      format: 'JSON',
    });
    const user = await raws.json();
    return user as never;
  }

  async create(user: User): Promise<(User & { id: number }) | null> {
    const connection = this.clickhouseService.getConnectionDetails();

    await connection.insert({
      table: 'users',
      values: [user],
      format: 'JSONEachRow',
    });

    const resultSet = await connection.query({
      query: `SELECT * FROM users WHERE email = {email:String}`,
      query_params: { email: user.email },
      format: 'JSONEachRow',
    });

    const rows = await resultSet.json<User[]>();
    return rows[0] as never;
  }
}
