import { Injectable, NotFoundException } from "@nestjs/common";
import { TaskStatus } from "./task-status.enum";
import { AddTaskDto } from "./dto/add-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TasksRepository } from "./tasks.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { DeleteResult } from "typeorm";
import { User } from "../auth/user.entity";


@Injectable()
export class TasksService {

  constructor (
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository
  ) {}

  getBy (filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.filterBy(filterDto, user);
  }

  async getById (id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id, user });
    if (!found) throw new NotFoundException("Task does not exist!");
    return found;
  }

  addOne (addTaskDto: AddTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.addTask(addTaskDto, user);
  }

  async deleteOne (id: string, user: User): Promise<void> {
    const result: DeleteResult = await this.tasksRepository.delete({ id, user });
    if (!result.affected) throw new NotFoundException("Task does not exist!");
  }

  async updateStatus (id: string, newStatus: TaskStatus, user: User): Promise<Task> {
    const task = await this.getById(id, user);
    task.status = newStatus;
    return this.tasksRepository.save(task);
  }


}
