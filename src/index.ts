require('dotenv').config()
import adminController from "./timezone/admin-controller";
import timezoneController from "./timezone/timezone-controller";
import requestLogger from "./request-logger";
import express from 'express';
import healthController from "./health-controller";
import authMiddlewares, { adminMiddleware } from "./auth/auth-middleware";

import mongoRepo from "./mongo";


mongoRepo.init();

const expressApp = express();
expressApp.use(requestLogger)
expressApp.get("/health", healthController)
expressApp.use(express.json())
expressApp.use("/rest/timezones/", authMiddlewares, timezoneController.router)
expressApp.use("/rest/admin/", authMiddlewares, adminMiddleware, adminController.router)

expressApp.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err, next)
  res.status(err['status'] || 500);
  res.json({message: err.message});
});
const port = process.env.PORT || 8080;
expressApp.listen(port, function () {
  console.info(`SERVICE RUNNING ON PORT ${port}`);
});
