/* eslint-disable prefer-const */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Histories } from './entity/histories.entity';
import { CreateHistoriesDto } from './dto/log-histories.dto';

@Injectable()
export class HistoriesService {
  constructor(
    @InjectRepository(Histories)
    private historiesRepository: Repository<Histories>,
  ) {}

  async findAll() {
    return 123;
  }

  async search(id: string, query: any) {
    let {
      relations,
      page,
      action,
      type,
      limit,
      sortBy = 'createdAt',
      sort,
      search,
      ...where
    } = query;
    page = parseInt(page) || 1;
    if (page < 1) page = 1;
    if (limit !== 'all') limit = parseInt(limit) || 10;
    else limit = 0;
    const skip = (page - 1) * limit || 0;
    if (relations) relations = relations.split(',');

    try {
      const [result, total] = await this.historiesRepository
        .createQueryBuilder('histories')
        .where(
          '(histories.userId = :userId AND histories.type LIKE :type AND histories.action LIKE :action)',
          {
            userId: id,
            type: `%${type || search || ''}%`,
            action: `%${action || search || ''}%`,
          },
        )

        .orderBy('histories.updatedTime', sort === 'ASC' ? 'ASC' : 'DESC')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return { result, total };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async logAction(
    userId: string,
    createHistoriesDto: CreateHistoriesDto,
  ): Promise<Histories> {
    const history = new Histories();
    history.userId = userId;
    history.action = createHistoriesDto.action;
    history.type = createHistoriesDto.type;
    history.description = createHistoriesDto.description;
    return await this.historiesRepository.save(history);
  }
}
