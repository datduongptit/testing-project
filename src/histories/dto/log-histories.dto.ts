import { IsNotEmpty } from 'class-validator';

export class CreateHistoriesDto {
  //   @IsNotEmpty({
  //     message: 'User is required',
  //   })
  //   userId: string;

  @IsNotEmpty({
    message: 'Action is required',
  })
  action: string;

  @IsNotEmpty({
    message: 'Type is required',
  })
  type: string;

  description: string;
}
