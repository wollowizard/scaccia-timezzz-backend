import express from "express";
import timezoneService from "./timezone-service";
import { UserTimezone } from "../model";
import asyncH from "express-async-handler";

class TimezoneController {
  public readonly router = express.Router();

  constructor() {
    this.router.get('/', asyncH(this.getTimezones));
    this.router.post('/', asyncH(this.addTimezone));
    this.router.put('/', asyncH(this.editTimezone));
    this.router.delete('/:timezoneName', asyncH(this.deleteTimezone));
  }

  getTimezones = async (req: express.Request, res: express.Response) => {
    throw "heelelleölwe"
    const timezones = await timezoneService.getTimezones(req.user.sub);
    return res.json(timezones)
  }

  addTimezone = async (req: express.Request, res: express.Response) => {
    const userTimezone: UserTimezone = req.body;
    userTimezone.uid = req.user.sub;
    await timezoneService.addTimezone(userTimezone);
    const timezones = await timezoneService.getTimezones(req.user.sub);
    return res.json(timezones)
  }

  editTimezone = async (req: express.Request, res: express.Response) => {
    const userTimezone: UserTimezone = req.body;
    userTimezone.uid = req.user.sub;
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
}

const timezoneController = new TimezoneController();
export default timezoneController;
