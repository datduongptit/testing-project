import { CreateProductDto } from './dto/products.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from './entity/products.entity';
import { S3 } from 'aws-sdk';
import { uid } from 'src/utils/functions';
import { extname } from 'path';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  async findAll(): Promise<Products[]> {
    return await this.productsRepository.find();
  }

  async create(createProductDto: CreateProductDto): Promise<Products> {
    try {
      const product = new Products();
      product.name = createProductDto.name;
      product.SKU = createProductDto.SKU;
      product.description = createProductDto.description;
      product.price = createProductDto.price;
      return await this.productsRepository.save(product);
    } catch (err) {
      throw new Error(`Error creating ${err} product ${err.message}`);
    }
  }

  async uploadFile(file, id) {
    if (!file) throw new BadRequestException('File invalid');
    const s3 = new S3({
      accessKeyId: 'AKIAQBFYOGILHSWNN67O',
      secretAccessKey: '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',
    });
    const fileName = `${Date.now()}-${uid()}${extname(
      file.originalname,
    ).toLowerCase()}`;
    const uploadResult = await s3
      .upload({
        Bucket: 'zeroes98',
        Body: file.buffer,
        Key: `${id}/${fileName}`,
        ContentType: file.mimetype,
        // ACL: 'public-read',
      })
      .promise();
    const { Location, Key } = uploadResult;
    const baseUrl = Location.replace(Key, '');
    const url = Key;
    return { baseUrl, url };
  }
}
