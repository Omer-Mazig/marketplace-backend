import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { UsersService } from './providers/users.service';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('active')
  @UseInterceptors(ClassSerializerInterceptor)
  public async getActiveUser(@ActiveUser() activeUser: ActiveUserData) {
    console.log(activeUser);

    return this.usersService.getActiveUser(activeUser);
  }

  @Get('user-data/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  public async getActiveUserData(@Param('id') id: number) {
    return this.usersService.getActiveUserData(id);
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @Auth(AuthType.None)
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
}
