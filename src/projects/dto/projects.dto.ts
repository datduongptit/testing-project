import { IsNotEmpty } from 'class-validator';

export class CreateProjecttDto {
  projectId: string;

  @IsNotEmpty({
    message: 'Manager is required',
  })
  manager: string;

  @IsNotEmpty({
    message: 'Customer is required',
  })
  customer: string;

  @IsNotEmpty({
    message: 'Name is required',
  })
  name: string;

  usersAssigned: string;
}
