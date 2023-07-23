/* eslint-disable prefer-const */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/users.entity';
import * as bcrypt from 'bcrypt';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = new User();
      const hashPassword = await bcrypt.hash(createUserDto.password, 10);
      user.username = createUserDto.username;
      user.email = createUserDto.email;
      user.password = hashPassword;
      user.role = createUserDto.role;
      return this.userRepository.save(user);
    } catch (err) {
      throw new Error(`Error creating ${err} user ${err.message}`);
    }
  }

  async getAllUserProfile(query: any): Promise<User[] | undefined> {
    try {
      const user = await this.userRepository.find({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          password: false,
          createdAt: true,
        },
        where: {
          username: Like(`%`),
        },
      });
      if (user) {
        return user;
      } else {
        throw new Error(`User not found`);
      }
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }

  async search(query: any) {
    let {
      relations,
      page,
      limit,
      sortBy = 'createdAt',
      sort,
      search,
      ...where
    } = query;
    console.log(search);

    page = parseInt(page) || 1;
    if (page < 1) page = 1;
    if (limit !== 'all') limit = parseInt(limit) || 10;
    else limit = 0;
    const skip = (page - 1) * limit || 0;
    if (relations) relations = relations.split(',');
    try {
      const [result, total] = await this.userRepository.findAndCount({
        where: [
          {
            username: Like(`%${search || ''}%`),
          },
          {
            email: Like(`%${search || ''}%`),
          },
        ],
        order: { [sortBy]: sort === 'ASC' ? 'ASC' : 'DESC' },
        skip,
        take: limit,
      });
      return result;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async update(id: string, values: QueryDeepPartialEntity<User>) {
    try {
      this.userRepository
        .createQueryBuilder()
        .update(User)
        .set(values)
        .where('id = :id', { id: id })
        .execute();
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }

  async findOne(email: string, password: string): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      const isMatch = await bcrypt.compare(password, user.password);
      if (user && isMatch) {
        return user;
      } else {
        throw new Error(`User not found`);
      }
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (user) {
        return user;
      } else {
        throw new Error(`User not found`);
      }
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }

  async findUserById(id: string): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
        },
        where: { id },
      });
      if (user) {
        return user;
      } else {
        throw new Error(`User not found`);
      }
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }

  async getUserById(id: string): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
        },
        where: { id },
      });

      if (user) {
        return user;
      } else {
        throw new Error(`User not found`);
      }
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }

  async getUserByListIds(listId: any): Promise<User[] | undefined> {
    try {
      const users = await this.userRepository.find({
        select: {
          id: true,
          username: true,
          role: true,
          email: true,
        },
        where: {
          id: In(listId),
        },
      });

      if (users) {
        return users;
      } else {
        throw new Error(`User not found`);
      }
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
        },
        where: { email },
      });
      if (user) {
        return user;
      } else {
        throw new Error(`User not found`);
      }
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }
}
