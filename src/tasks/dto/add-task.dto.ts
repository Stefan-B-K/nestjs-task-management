import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { TaskStatus } from "../task-status.enum";


export class AddTaskDto {
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  description: string

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus
}
