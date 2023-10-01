import { DataSource, Repository } from "typeorm";
import { Task } from "./task.entity";
import { Injectable } from "@nestjs/common";
import { AddTaskDto } from "./dto/add-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { User } from "../auth/user.entity";

@Injectable()
export class TasksRepository extends Repository<Task> {

  constructor (private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async addTask (addTask: AddTaskDto, user: User): Promise<Task> {
    const task: Task = this.create({
      status: TaskStatus.open,
      ...addTask,
      user
    });
    return await this.save(task);
  }

  async filterBy (filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder("task");
    query.where({ user });

    if (status) {
      query
        .andWhere("task.status = :status", { status });
    }
    if (search) {
      query
        .andWhere(
          "( LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search) )",
          { search: `%${search}%` }
        );
    }

    return await query.getMany();
  }

}
