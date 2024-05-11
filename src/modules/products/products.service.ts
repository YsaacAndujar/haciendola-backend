import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrUpdateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ILike, Not, Repository, FindOptionsWhere } from 'typeorm';
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

  private async validateProductCreateDto({ handle }: CreateOrUpdateProductDto, id: number = undefined) {
    const where: FindOptionsWhere<Product> = {
      handle,
    }
    if (id) {
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

  async findAll({handle, skip, take}: GetPaginatedProductsDto) {
    let whereClause: FindOptionsWhere<Product> = {};
    if (handle) {
      whereClause.handle = ILike(`%${handle}%`);
    }

    const [result, total] = await this.productRepository.findAndCount(
      {
        where: {
          ...whereClause
        },
        order: { id: "DESC" },
        take: take,
        skip: skip,
        select: {
          id: true,
          handle: true,
          title: true,
          stock: true,
          price: true
        },

      }
    );

    return {
      result,
      total
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
