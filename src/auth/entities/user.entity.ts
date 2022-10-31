import { ApiProperty } from "@nestjs/swagger";
import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

	@PrimaryGeneratedColumn('uuid')
	@ApiProperty({
		example: '557d7cd1-cf0d-4109-a04d-78ae84e74eec',
		description: 'User Id',
		uniqueItems: true
	})
	id: string

	@Column('text',{
		unique:true
	})
	@ApiProperty({
		example: 'Justyn.Zieme@gmail.com',
		description: 'User Email',
		uniqueItems: true
	})
	email:string

	@Column('text',{select: false})
	@ApiProperty({
		example: 'SDPVvFpN7tGgC__',
		description: 'User Password',
		uniqueItems: true
	})
	password:string

	@Column('text',
	{
		name:'full_name'
	})
	@ApiProperty({
		example: 'Dwight Langosh',
		description: 'User Name',
		uniqueItems: true
	})
	fullName:string

	@Column('bool', {
		default:true,
		name:'is_active'
	})
	@ApiProperty({
		example: true,
		description: 'User Status',
		uniqueItems: true
	})
	isActive:boolean

	@Column('text', {
		array:true,
		default:['user']
	})
	@ApiProperty({
		example: ['admin', 'user', 'super-admin'],
		description: 'User Roles',
		uniqueItems: true
	})
	roles:string[]

	@OneToMany(
		() => Product,
		(product) => product.user
	)
	product: Product

	@BeforeInsert()
	checkFieldsBeforeInsert(){
		this.email = this.email.toLowerCase().trim()
	}

	@BeforeUpdate()
	checkFieldsBeforeUpdate(){
		this.checkFieldsBeforeInsert()
	}

}
