import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrUpdateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Not, Repository } from 'typeorm';
import { GetPaginatedProductsDto } from './dto/get-products.dto';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateOrUpdateProductDto) {
    await this.validateProductCreateDto(createProductDto)
    const product: Product = {
      id: undefined,
      ...createProductDto
    }
    const result = await this.productRepository.save(product)
    return result
  }

  private async validateProductCreateDto({ handle }: CreateOrUpdateProductDto, id:number=undefined) {
    const where:any = { 
      handle 
    }
    if(id){
      where.id = Not(id)
    }
    console.log(where)
    const product = await this.productRepository.findOne({
      where
    })
    if (product) {
      throw new BadRequestException("Ya existe un producto con ese handle")
    }
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
      where: { id },
    })
    if (!product) throw new NotFoundException()
    return product;
  }

  async update(id: number, updateProductDto: CreateOrUpdateProductDto) {
    await this.findOne(id)
    await this.validateProductCreateDto(updateProductDto, id)
    await this.productRepository.update(id, {
      ...updateProductDto
    })
  }

  async remove(id: number) {
    await this.productRepository.delete(id);
  }
}
