import express from "express";
import timezoneService from "./timezone-service";
import { UserTimezone } from "../model";
import asyncH from "express-async-handler";
import { isAdmin } from "../auth/auth-middleware";

class TimezoneController {
  public readonly router = express.Router();

  constructor() {
    this.router.get('/', asyncH(this.getTimezones));
    this.router.post('/', asyncH(this.addTimezone));
    this.router.put('/', asyncH(this.editTimezone));
    this.router.delete('/:timezoneName', asyncH(this.deleteTimezone));
  }

  getTimezones = async (req: express.Request, res: express.Response) => {
    const timezones = await timezoneService.getTimezones(req.user.sub);
    return res.json(timezones)
  }

  addTimezone = async (req: express.Request, res: express.Response) => {
    const userTimezone: UserTimezone = req.body;
    this.setUid(req, userTimezone)
    await timezoneService.addTimezone(userTimezone);
    const timezones = await timezoneService.getTimezones(req.user.sub);
    return res.json(timezones)
  }

  editTimezone = async (req: express.Request, res: express.Response) => {
    const userTimezone: UserTimezone = req.body;
    this.setUid(req, userTimezone)
    await timezoneService.editTimezone(userTimezone);
    const timezones = await timezoneService.getTimezones(req.user.sub);
    return res.json(timezones)
  }

  deleteTimezone = async (req: express.Request, res: express.Response) => {
    const timezoneName = req.params["timezoneName"];
    await timezoneService.deleteTimezone(req.user.sub, timezoneName);
    const timezones = await timezoneService.getTimezones(req.user.sub);
    return res.json(timezones)
  }

  setUid = (req: express.Request, userTimezone: UserTimezone) => {
    if (!isAdmin(req.user) || (isAdmin(req.user) && !userTimezone.uid)) {
      userTimezone.uid = req.user.sub;
    }
  }
}

const timezoneController = new TimezoneController();
export default timezoneController;
