import { IsNotEmpty } from 'class-validator';
import { PROJECT_STATUS } from 'src/enums/project.enum';

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
    message: 'User report is required',
  })
  userReport: string;

  @IsNotEmpty({
    message: 'Name is required',
  })
  name: string;

  @IsNotEmpty({
    message: 'Status is required',
  })
  status: PROJECT_STATUS;

  usersAssigned: string;
  startedAt: Date;
  endAt: Date;

  userReview: string;
}
