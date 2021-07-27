import express from "express";
import timezoneService from "./timezone-service";
import { Timezone, UserTimezone } from "../model";
import asyncH from "express-async-handler";
import { isAdmin } from "../auth/auth-middleware";
import { checkIntegerBetween, checkNonEmptyString } from "../utils/validation-utils";

class TimezoneController {
  public readonly router = express.Router();

  constructor() {
    this.router.get('/', asyncH(this.getTimezones));
    this.router.post('/', asyncH(this.addTimezone));
    this.router.put('/', asyncH(this.editTimezone));
    this.router.delete('/:timezoneName', asyncH(this.deleteTimezone));
  }

  getTimezones = async (req: express.Request, res: express.Response) => {
    const uid = this.getUid(req);
    const timezones = await timezoneService.getTimezones(uid);
    return res.json(timezones)
  }

  addTimezone = async (req: express.Request, res: express.Response) => {
    const timezone: Timezone = req.body;
    this.validateTimezone(timezone);
    const userTimezone = this.addUid(req, timezone);
    const id: string | null = await timezoneService.addTimezone(userTimezone);
    return res.json({id})
  }

  editTimezone = async (req: express.Request, res: express.Response) => {
    const timezone: Timezone = req.body;
    this.validateTimezone(timezone);
    const userTimezone = this.addUid(req, timezone);
    const edited = await timezoneService.editTimezone(userTimezone);
    return res.json(edited)
  }

  deleteTimezone = async (req: express.Request, res: express.Response) => {
    const uid = this.getUid(req);
    const timezoneName = req.params["timezoneName"];
    await timezoneService.deleteTimezone(uid, timezoneName);
    return res.end();
  }

  getUid = (req: express.Request): string => {
    const uidQuery = req.query["uid"] as string;
    if (uidQuery?.length) {
      if (!isAdmin(req.user)) {
        throw {
          status: 403,
          message: "Not admins are not allowed to perform operation for other user"
        }
      }
      return uidQuery;
    }
    return req.user.sub;
  }

  addUid = (req: express.Request, timezone: Timezone): UserTimezone => {
    return {
      ...timezone,
      uid: this.getUid(req)
    }
  }

  validateTimezone = (timezone: Timezone) => {
    checkNonEmptyString(timezone?.timezoneCity)
    checkNonEmptyString(timezone?.timezoneName)
    checkIntegerBetween(timezone?.gmtDifferenceMinutes, -14 * 60, 14 * 60);
  }
}

const timezoneController = new TimezoneController();
export default timezoneController;
