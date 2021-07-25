import { ObjectId } from "mongodb";
import mongoRepo from "../mongo";

export interface Task {
  _id?: ObjectId,
  description: string,
  completed: boolean,
  createdBy: string
}

const voidify = () => {
  return;
}

class TaskService {
  get = async (id: string): Promise<Task | undefined> => {
    const task: Task | undefined = await mongoRepo.db().collection("tasks").findOne<Task>({_id: new ObjectId(id)});
    return task;
  }

  getAll = async (): Promise<Task[]> => {
    const tasks: Task[] = await mongoRepo.db().collection("tasks").find({}).toArray();
    return tasks;
  }

  create = async (tasks: Task[]): Promise<void> => {
    return mongoRepo.db().collection("tasks").insertMany(tasks).then(voidify);
  }

  update = async (id: string, partialTask: Partial<Task>): Promise<void> => {
    return mongoRepo.db().collection("tasks")
    .updateOne({_id: new ObjectId(id)},
      {$set: {...partialTask}},
      {upsert: false}
    ).then(voidify);
  }

  delete = async (id: string): Promise<void> => {
    return mongoRepo.db().collection("tasks")
    .deleteOne({_id: new ObjectId(id)})
    .then(voidify);
  }
}

export default new TaskService();
