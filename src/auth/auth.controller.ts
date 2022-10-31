import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Auth, GetUser, RawHeaders } from './decorators';
import { RoleProtected } from './decorators/role-protected.decorator';
import { CreateUserDto, LoginUserDto } from './dto/';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

	@Post('register')
	@ApiResponse({status:201, description: 'user created', type: User})
	@ApiResponse({status:400, description: 'Bad Request'})
	@ApiResponse({status:403, description: 'Forbidden. Token related'})	
	createUser(@Body() createUserDto: CreateUserDto) {
		return this.authService.create(createUserDto);
	}

	@Post('login')
	@ApiResponse({status:200, description: 'Ok'})
	@ApiResponse({status:400, description: 'Bad Request'})
	@ApiResponse({status:404, description: 'Not found'})
	@ApiResponse({status:500, description: 'Internal Server Error'})
	loginUser(@Body() loginUserDto: LoginUserDto) {
		return this.authService.login(loginUserDto);
	}

	@Get('check-status')
	@Auth()
	@ApiResponse({status:200, description: 'Ok'})
	@ApiResponse({status:400, description: 'Bad Request'})
	@ApiResponse({status:404, description: 'Not found'})
	@ApiResponse({status:403, description: 'Forbidden. Token related'})	
	@ApiResponse({status:500, description: 'Internal Server Error'})
	checkAuthStatus(
		@GetUser() user: User
	) {
		return this.authService.checkAuthStatus(user)
	}

	@Get('private')
	@UseGuards(AuthGuard())
	@ApiResponse({status:200, description: 'Ok'})
	@ApiResponse({status:400, description: 'Bad Request'})
	@ApiResponse({status:404, description: 'Not found'})
	@ApiResponse({status:403, description: 'Forbidden. Token related'})	
	@ApiResponse({status:500, description: 'Internal Server Error'})
	testingPrivateRoute(
		@Req() request: Express.Request,
		@GetUser() user: User,
		@GetUser(['email']) email: string,
		@RawHeaders() rawHeaders: string[],
	) {
		// console.log({user: request.user})

		return {
			ok: true,
			message: 'Hola mundo private',
			user: user,
			email,
			rawHeaders
		}
	}
	
	//@SetMetadata('roles', ['admin', 'superuser'])
	@Get('private2')
	@RoleProtected(ValidRoles.superUser)
	@UseGuards(AuthGuard(), UserRoleGuard)
	@ApiResponse({status:200, description: 'Ok'})
	@ApiResponse({status:400, description: 'Bad Request'})
	@ApiResponse({status:404, description: 'Not found'})
	@ApiResponse({status:403, description: 'Forbidden. Token related'})	
	@ApiResponse({status:500, description: 'Internal Server Error'})
	privateRoute2(
		@GetUser() user: User
	){
		return {
			ok: true,
			user,
		}
	}

	@Get('private3')
	@Auth(ValidRoles.admin)
	@ApiResponse({status:200, description: 'Ok'})
	@ApiResponse({status:400, description: 'Bad Request'})
	@ApiResponse({status:404, description: 'Not found'})
	@ApiResponse({status:403, description: 'Forbidden. Token related'})	
	@ApiResponse({status:500, description: 'Internal Server Error'})
	privateRoute3(
		@GetUser() user: User
	){
		return {
			ok: true,
			user,
		}
	}

}
