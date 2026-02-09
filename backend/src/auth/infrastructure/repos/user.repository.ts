import { BadGatewayException, Injectable } from '@nestjs/common';
import { User } from 'src/auth/domain/entities/user.entity';
import { IUserRepository } from 'src/auth/domain/repos/user.repository';
import { PgService } from 'src/pg/pg.service';

@Injectable()
export class UserRepositoryPostgres implements IUserRepository {
  constructor(private readonly pgService: PgService) {}

  async findByEmail(email: string): Promise<User | null> {
    const client = this.pgService.getPool();
    try {
      const result = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email],
      );

      if (result.rows && result.rows.length > 0) {
        return result.rows[0] as User;
      }

      return null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<User | null> {
    const client = this.pgService.getPool();
    try {
      const result = await client.query('SELECT * FROM users WHERE id = $1', [
        id,
      ]);

      if (result.rows && result.rows.length > 0) {
        return result.rows[0] as User;
      }

      return null;
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }

  async create(user: User): Promise<(User & { id: number }) | null> {
    const client = this.pgService.getPool();

    try {
      const existingUserResult = await client.query(
        'SELECT id FROM users WHERE full_name = $1',
        [user.full_name],
      );

      const existingRows =
        existingUserResult?.rows ||
        existingUserResult;

      if (Array.isArray(existingRows) && existingRows.length > 0) {
        throw new BadGatewayException(
          `User with full name "${user.full_name}" already exists`,
        );
      }

      await client.query(
        'INSERT INTO users (email, full_name, pass, occupation) VALUES ($1, $2, $3, $4)',
        [user.email, user.full_name, user.pass, user.occupation],
      );

      const resultSet = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [user.email],
      );

      const rows = resultSet?.rows || resultSet;

      if (Array.isArray(rows) && rows.length > 0) {
        return rows[0] as User & { id: number };
      }

      return null;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
}
