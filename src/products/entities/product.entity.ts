import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./";

@Entity({name:'products'})
export class Product {
	@ApiProperty({
		example: '0d62f9a1-714f-44c2-b398-9ef2f7e2af03',
		description: 'Product ID',
		uniqueItems: true
	})
	@PrimaryGeneratedColumn('uuid')
	id:string

	@ApiProperty({
		example: 'T-Shirt Teslo',
		description: 'Product Title',
		uniqueItems: true
	})
	@Column('text', {
		unique:true,

	})
	title:string

	@ApiProperty({
		example: 0,
		description: 'Product Price'
	})
	@Column('float', {
		default:0
	})
	price:number

	@ApiProperty({
		example: 'Consequat reprehenderit dolore laborum laborum irure labore proident proident pariatur commodo cillum.',
		description: 'Product Description',
		default: null,
	})
	@Column({
		type:'text',
		nullable: true
	})
	description:string


	@ApiProperty({
		example: 't_shirt_teslo',
		description: 'Product Slug - for SEO',
		uniqueItems: true
	})
	@Column('text', {
		unique:true
	})
	slug:string

	@ApiProperty({
		example: 10,
		description: 'Product Stock',
		default: 0,
	})
	@Column('int', {
		default: 0
	})
	stock:number

	@ApiProperty({
		example: ['M', 'XL', 'XXL'],
		description: 'Product Sizes',
	})
	@Column('text',{
		array: true
	})
	sizes: string[]

	@ApiProperty({
		example: 'women',
		description: 'Product Gender',
	})
	@Column('text')
	gender:string

	@ApiProperty()
	@Column('text',{
		array:true,
		default: []
	})
	tags:string[]

	@ApiProperty()
	@OneToMany(
		() => ProductImage,
		(productImage) => productImage.product,
		{cascade:true, eager:true}
	)
	images?:ProductImage[]

	@ManyToOne(
		() => User,
		(user) => user.product,
		{ eager:true }
	)
	user: User

	@BeforeInsert()
	CheckSlugInsert(){
		if (!this.slug ) {
			this.slug = this.title
		}

		this.slug = this.slug
		.toLowerCase()
		.replaceAll(' ', '_')
		.replaceAll("'", '')
	}

	@BeforeUpdate()
	checkSlugUpdate(){
		this.slug = this.slug
		.toLowerCase()
		.replaceAll(' ', '_')
		.replaceAll("'", '')
	}
}
