import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { ValidRoles } from 'src/auth/interfaces';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Post()
	@Auth()
	@ApiResponse({status:201, description: 'product was created', type: Product})
	@ApiResponse({status:400, description: 'Bad Request'})
	@ApiResponse({status:403, description: 'Forbidden. Token related'})
	create(
		@Body() createProductDto: CreateProductDto,
		@GetUser() user: User,
	) {
		return this.productsService.create(createProductDto, user);
	}

	@Get()
	@ApiResponse({status:200, description: 'Ok', type: Product})
	findAll(@Query() paginationDto:PaginationDto) {
		return this.productsService.findAll(paginationDto);
	}

	@Get(':term')
	@ApiResponse({status:200, description: 'Ok', type: Product})
	@ApiResponse({status:400, description: 'Bad Request'})
	findOne(@Param('term') term: string) {
		return this.productsService.findOnePlain(term);
	}

	@Patch(':id')
	@Auth(ValidRoles.admin)
	@ApiResponse({status:200, description: 'Ok', type: Product})
	@ApiResponse({status:400, description: 'Bad Request'})
	@ApiResponse({status:403, description: 'Forbidden. Token related'})
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateProductDto: UpdateProductDto,
		@GetUser() user:User,
		) {
		return this.productsService.update(id, updateProductDto, user);
	}

	@Delete(':id')
	@Auth(ValidRoles.admin)
	@ApiResponse({status:200, description: 'Ok', type: Product})
	@ApiResponse({status:400, description: 'Bad Request'})
	@ApiResponse({status:403, description: 'Forbidden. Token related'})
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.productsService.remove(id);
	}
}
