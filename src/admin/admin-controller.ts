import * as express from "express";
import userService from "../user/user-service";

class AdminController {
  public readonly router = express.Router();

  constructor() {
    this.router.get(`/timezones`, this.getTimezones);
    this.router.post(`/timezones/:timezone`, this.addTimezone);
    this.router.delete(`/timezones/:timezone`, this.deleteTimezone);
  }

  getTimezones = async (req: express.Request, res: express.Response) => {
    const timezones = await userService.getTimezones();
    return res.json({timezones})
  }

  addTimezone = async (req: express.Request, res: express.Response) => {
    const timezone = req.params["timezone"];
    await userService.addTimezone(req.user.sub, timezone);
    const timezones = await userService.getTimezones();
    return res.json({timezones})
  }

  deleteTimezone = async (req: express.Request, res: express.Response) => {
    const timezone = req.params["timezone"];
    await userService.deleteTimezone(req.user.sub, timezone);
    const timezones = await userService.getTimezones();
    return res.json({timezones})
  }
}

const adminController = new AdminController();
export default adminController;

