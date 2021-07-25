import * as express from "express";
import taskService, { Task } from "./task-service";


class TaskController {
  public router = express.Router();

  constructor() {
    this.router.get(`/:id`, this.getTask);
    this.router.get(`/`, this.getTasks);
    this.router.patch(`/:id`, this.updateTask);
    this.router.post(`/`, this.createTask);
    this.router.delete(`/:id`, this.deleteTask);
  }

  private getTasks = async (request: express.Request, response: express.Response) => {
    const tasks = await taskService.getAll();
    response.json(tasks);
  }

  private getTask = async (request: express.Request, response: express.Response) => {
    const id: string = request.params["id"];
    const task = await taskService.get(id);
    if (task)
      return response.json(task);
    else
      return response.status(404).json({error: "NOT_FOUND"}).end();
  }

  private createTask = async (request: express.Request, response: express.Response) => {
    const task: Task = request.body;
    task.createdBy = request.userProfile.sub
    await taskService.create([task]);
    response.end()
  }

  private updateTask = async (request: express.Request, response: express.Response) => {
    const partialTask: Partial<Task> = request.body;
    const id: string = request.params["id"];
    await taskService.update(id, partialTask);
    response.end()
  }

  private deleteTask = async (request: express.Request, response: express.Response) => {
    const id: string = request.params["id"];
    await taskService.delete(id);
    response.end()
  }
}

const taskController = new TaskController()
export default taskController;
