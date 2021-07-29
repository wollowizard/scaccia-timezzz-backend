import express from "express";
import asyncH from "express-async-handler";
import userService from "./user-service";

class UserController {
  public readonly router = express.Router();

  constructor() {
    this.router.get('/', asyncH(this.getUsers));
  }

  getUsers = async (req: express.Request, res: express.Response) => {
    const search: string = req.query["search"] as string || "";
    const users = await userService.getUsers(search);
    return res.json(users)
  }
}

const userController = new UserController();
export default userController;
