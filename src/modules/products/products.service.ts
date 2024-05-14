import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository, FindOptionsWhere } from 'typeorm';
import { CreateOrUpdateProductDto, GetPaginatedProductsDto } from './dto';
import { Product } from './entities';

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
    const product = await this.productRepository.findOne({
      where
    })
    if (product) {
      throw new BadRequestException("Ya existe un producto con ese handle")
    }
  }

  async findAll({param, page, take,}: GetPaginatedProductsDto) {
    let whereClause: FindOptionsWhere<Product>[] = [];
    if (param) {
      whereClause= [
       {handle: ILike(`%${param}%`)},
       {title: ILike(`%${param}%`)},
      ]
     }

    const [result, total] = await this.productRepository.findAndCount(
      {
        where: whereClause,
        order: { id: "DESC" },
        take: take,
        skip: (page-1)*take,
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
