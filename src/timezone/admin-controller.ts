import express from "express";
import timezoneService from "./timezone-service";
import asyncH from "express-async-handler";

class AdminController {
  public readonly router = express.Router();

  constructor() {
    this.router.get('/users/:uid/timezones/', asyncH(this.getTimezonesOfUser));
  }

  getTimezonesOfUser = async (req: express.Request, res: express.Response) => {
    let uid: string | undefined = req.params["uid"];
    if (uid === "ALL") {
      uid = undefined;
    }
    const timezones = await timezoneService.getTimezones(uid);
    return res.json(timezones)
  }
}

const adminController = new AdminController();
export default adminController;
