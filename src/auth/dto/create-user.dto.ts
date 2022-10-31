import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator"

export class CreateUserDto {

	@IsString()
	@IsEmail()
	@ApiProperty({
		example: 'lorem.ipsur@mail.com',
		description: 'User Email',
		uniqueItems: true
	})
	email:string

	@IsString()
	@MinLength(6)
	@MaxLength(50)
	@Matches(
		/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'The password must have a Uppercase, lowercase letter and a number'
	})
	@ApiProperty({
		example: '-_hwM=cO%L8C04O%g5PI',
		description: 'User Password',
		uniqueItems: true
	})
	password:string
	
	@IsString()
	@Expose({name:'full_name'})
	@ApiProperty({
		example: 'Elbert Funk',
		description: 'User Name',
		uniqueItems: true
	})
	fullName:string
}