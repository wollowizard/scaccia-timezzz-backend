import express from "express";

class TimezoneController {
  public readonly router = express.Router();

  constructor() {
    this.router.get(`/diff/:from/:to`, this.getTimeDiff);
  }

  getTimeDiff = (req: express.Request, res: express.Response) => {

  }
}

const timezoneController = new TimezoneController();
export default timezoneController;
