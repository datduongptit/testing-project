import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, Matches } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    required: true,
    example: 'John',
  })
  @IsNotEmpty({
    message: 'First name cannot be empty or whitespace',
  })
  @Length(2, 30, {
    message: 'First name must be between 3 and 30 characters long',
  })
  username: string;

  @ApiProperty({
    required: true,
    example: 'Doe',
  })
  @IsNotEmpty({
    message: 'Last name cannot be empty or whitespace',
  })
  @Length(3, 50, {
    message: 'Last name must be between 3 and 50 characters long',
  })
  email: string;
}
