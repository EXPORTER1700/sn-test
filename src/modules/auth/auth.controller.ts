import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from '@app/modules/user/dto/create-user.dto';
import { AuthService } from '@app/modules/auth/auth.service';
import { SuccessResponseDto } from '@app/common/dto/success-response.dto';
import { LoginWithCredentialsGuard } from '@app/modules/auth/guard/login-with-credentials.guard';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { UnprocessableErrorApiResponseDto } from '@app/common/swagger-api-response/dto/unprocessable-error-api-response.dto';
import { BadRequestErrorApiResponseDto } from '@app/common/swagger-api-response/dto/bad-request-error-api-response.dto';
import { UnauthorizedErrorApiResponseDto } from '@app/common/swagger-api-response/dto/unauthorized-error-api-response.dto';
import { ForbiddenErrorApiResponseDto } from '@app/common/swagger-api-response/dto/forbidden-error-api-response.dto';
import { LoginDto } from '@app/modules/auth/dto/login.dto';
import { ResetPasswordDto } from '@app/modules/user/dto/reset-password.dto';
import { InternalServerErrorApiResponseDto } from '@app/common/swagger-api-response/dto/internal-server-error-api-response.dto';
import { LocalAuthGuard } from '@app/modules/auth/guard/auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  @ApiCreatedResponse({
    type: SuccessResponseDto,
    description: 'User was successfully create',
  })
  @ApiUnprocessableEntityResponse({
    type: UnprocessableErrorApiResponseDto,
    description: 'Username or email is already taken',
  })
  @ApiBadRequestResponse({
    type: BadRequestErrorApiResponseDto,
    description: 'Not valid dto',
  })
  public registration(@Body() dto: CreateUserDto): Promise<SuccessResponseDto> {
    return this.authService.registration(dto);
  }

  @Get('confirm-email/:token')
  @ApiOkResponse({
    type: SuccessResponseDto,
    description: 'Email was successfully confirm',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedErrorApiResponseDto,
    description: 'Token is not valid',
  })
  @ApiUnprocessableEntityResponse({
    type: UnprocessableErrorApiResponseDto,
    description: 'User does not exist',
  })
  public confirmEmail(
    @Param('token') token: string,
  ): Promise<SuccessResponseDto> {
    return this.authService.confirmEmail(token);
  }

  @Post('login')
  @ApiCreatedResponse({
    type: SuccessResponseDto,
    description: 'User was successfully login',
  })
  @ApiUnprocessableEntityResponse({
    type: UnprocessableErrorApiResponseDto,
    description: 'User does not exist',
  })
  @ApiForbiddenResponse({
    type: ForbiddenErrorApiResponseDto,
    description: 'Email is not confirmed or user is banned',
  })
  @ApiBody({ type: LoginDto })
  @UseGuards(LoginWithCredentialsGuard)
  public login(): SuccessResponseDto {
    return new SuccessResponseDto();
  }

  @Delete('logout')
  @ApiOkResponse({
    type: SuccessResponseDto,
    description: 'User was successfully logout',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorApiResponseDto,
    description: 'Internal server error',
  })
  @UseGuards(LocalAuthGuard)
  public logout(@Req() req: Request): Promise<SuccessResponseDto> {
    return this.authService.logout(req);
  }

  @Get('forgot-password/:email')
  @ApiOkResponse({
    type: SuccessResponseDto,
    description: 'Send reset password link on email',
  })
  @ApiUnprocessableEntityResponse({
    type: UnprocessableErrorApiResponseDto,
    description: 'User does not exist',
  })
  public async forgotPassword(
    @Param('email') email: string,
  ): Promise<SuccessResponseDto> {
    return this.authService.forgotPassword(email);
  }

  @Put('reset-password/:token')
  @ApiOkResponse({
    type: SuccessResponseDto,
    description: 'Password was successfully reset',
  })
  @ApiUnprocessableEntityResponse({
    type: UnprocessableErrorApiResponseDto,
    description: 'User does not exist',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedErrorApiResponseDto,
    description: 'Not valid token',
  })
  public async resetPassword(
    @Param('token') token: string,
    @Body() dto: ResetPasswordDto,
  ): Promise<SuccessResponseDto> {
    return this.authService.resetPassword(token, dto);
  }
}
