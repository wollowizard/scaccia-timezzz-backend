/*import axios from "axios";
import { Task } from "../task/task-service";
import mongoRepo from "../mongo";
import mongo from "../mongo";

const task1: Task = {
  description: "task1",
  completed: false,
  createdBy: "google-oauth2|113300806490854534957"
}
const task2 = {...task1, description: "task2"}
const task4 = {...task1, description: "task4"}

let insertedId1: string;
let insertedId4: string;

describe('Tasks', () => {
  beforeAll(async () => {
    await mongoRepo.init();
    await mongo.db().collection("tasks").deleteMany({});
    await mongo.db().collection("tasks").insertOne(task1).then(res => insertedId1 = res.insertedId.toHexString())
    return mongo.db().collection("tasks").insertOne(task4).then(res => insertedId4 = res.insertedId.toHexString())
  })

  afterAll(async () => {
    await mongoRepo.init();
    await mongo.db().collection("tasks").deleteMany({});
  })

  test('get all tasks', async () => {
    const res: Task[] = (await axios.get("http://localhost:8080/rest/tasks/")).data
    expect(res[0]).toMatchObject(task1)
  })

  test('get task', async () => {
    const res: Task = (await axios.get(`http://localhost:8080/rest/tasks/${insertedId1}`)).data
    expect(res).toMatchObject(task1)
  })

  test('create tasks', async () => {
    const res = (await axios.post(`http://localhost:8080/rest/tasks/`, task2))
    expect(res.status).toEqual(200)
    const tasks: Task[] = (await axios.get("http://localhost:8080/rest/tasks/")).data
    expect(tasks.find(i => i.description === task1.description)).toMatchObject(task1)
    expect(tasks.find(i => i.description === task2.description)).toMatchObject(task2)
  })

  test('delete task', async () => {
    expect((await axios.get(`http://localhost:8080/rest/tasks/${insertedId4}`)).data).toMatchObject(task4)
    expect((await axios.delete(`http://localhost:8080/rest/tasks/${insertedId4}`)).status).toEqual(200)
    try {
      await axios.get(`http://localhost:8080/rest/tasks/${insertedId4}`)
      fail('it should not reach here');
    } catch (e) {
    }
  })
})
*/
