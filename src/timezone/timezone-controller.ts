import express from "express";
import timezoneService from "./timezone-service";

class TimezoneController {
  public readonly router = express.Router();

  constructor() {
    this.router.get(`/diff/:from/:to`, this.getTimeDiff);
  }

  getTimeDiff = (req: express.Request, res: express.Response) => {
    const from: string = req.params["from"];
    const to: string = req.params["to"];
    const unix = timezoneService.timeNow();
    const diffInMinutes = timezoneService.diffInMinutes(unix, from, to);
    const timeFrom = timezoneService.timeAt(unix, from);
    const timeTo = timezoneService.timeAt(unix, to);
    return res.json({diffInMinutes, timeFrom, timeTo, unix})
  }
}

const timezoneController = new TimezoneController();
export default timezoneController;
