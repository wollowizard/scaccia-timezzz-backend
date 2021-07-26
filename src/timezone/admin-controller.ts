import express from "express";
import timezoneService from "./timezone-service";
import asyncH from "express-async-handler";
import userService from "../user/user-service";

class AdminController {
  public readonly router = express.Router();

  constructor() {
    this.router.get('/users/:uid/timezones/', asyncH(this.getTimezonesOfUser));
    this.router.get('/users/', asyncH(this.getUsers));
  }

  getTimezonesOfUser = async (req: express.Request, res: express.Response) => {
    let uid: string | undefined = req.params["uid"];
    if (uid === "ALL") {
      uid = undefined;
    }
    const timezones = await timezoneService.getTimezones(uid);
    return res.json(timezones)
  }

  getUsers = async (req: express.Request, res: express.Response) => {
    const search: string = req.query["search"] as string || "ALL";
    const users = await userService.getUsers(search);
    return res.json(users)
  }
}

const adminController = new AdminController();
export default adminController;
