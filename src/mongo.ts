import { MongoClient } from "mongodb"
import ProfileUtils from "./config/profile-utils";

class MongoRepo {
  readonly client: MongoClient

  constructor() {
    this.client = new MongoClient(process.env.SECRET_MONGODB_URI!!);
  }

  init = () => {
    return this.client.connect();
  }

  db = () => {
    const dbName = ProfileUtils.requireConfig("mongo.db");
    return mongoRepo.client.db(dbName)
  }

}

const mongoRepo = new MongoRepo();
export default mongoRepo;
