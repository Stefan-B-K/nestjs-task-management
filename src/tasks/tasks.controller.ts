import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { AddTaskDto } from "./dto/add-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";
import { Task } from "./task.entity";
import { AuthGuard } from "@nestjs/passport";
import { User } from "../auth/user.entity";
import { GetUser } from "../auth/get-user.decorator";


@Controller("tasks")
@UseGuards(AuthGuard())
export class TasksController {
  constructor (private tasksService: TasksService) {}

  @Get()
  getTasks (
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User
    ): Promise<Task[]> {
      return this.tasksService.getBy(filterDto, user);
  }

  @Get("/:id")
  getTaskById (
    @Param("id") id: string,
    @GetUser() user: User
    ): Promise<Task> {
    return this.tasksService.getById(id, user);
  }

  @Post()
  addTask (
    @Body() addTask: AddTaskDto,
    @GetUser() user: User
    ): Promise<Task> {
    return this.tasksService.addOne(addTask, user);
  }

  @Delete("/:id")
  deleteTask (
    @Param("id") id: string,
    @GetUser() user: User
  ): Promise<void> {
    return this.tasksService.deleteOne(id, user);
  }

  @Patch("/:id/:status")
  updateTaskStatus (
    @Param("id") id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User
  ): Promise<Task>  {
    return this.tasksService.updateStatus(id, updateTaskStatusDto.status, user);
  }
}