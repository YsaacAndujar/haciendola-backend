import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { GetPaginatedProductsDto } from './dto/get-products.dto';

@Injectable()
export class ProductsService {
  
  constructor(
    @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
  ){}

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll(dto: GetPaginatedProductsDto) {

    const [result, total] = await this.productRepository.findAndCount(
        {
            order: { id: "DESC" },
            take: dto.limit,
            skip: dto.page
        }
    );

    return {
        result: result,
        count: total
    }
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where:{id},
    })
    if(!product) throw new NotFoundException()
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: number) {
    await this.productRepository.delete(id);
  }
}
