require('dotenv').config()
import adminController from "./admin/admin-controller";
import timezoneController from "./timezone/timezone-controller";
import requestLogger from "./request-logger";
import express from 'express';
import healthController from "./health-controller";
import auth0middlewares from "./auth/auth-middleware";
import taskController from "./task/task-controller";
import cityController from "./cities/city-controller";


import mongoRepo from "./mongo";
import userController from "./user/user-controller";


mongoRepo.init();

const expressApp = express();
expressApp.use(requestLogger)
//expressApp.use(auth0middlewares);
expressApp.get("/health", healthController)
expressApp.use(express.json())
expressApp.use("/rest/tasks/", taskController.router)
expressApp.use("/rest/cities/", cityController.router)
expressApp.use("/rest/timezones/", timezoneController.router)
expressApp.use("/rest/users/", auth0middlewares, userController.router)
expressApp.use("/rest/admin/",
  //auth0middlewares,
  //adminMiddleware
  adminController.router)


const port = process.env.PORT || 8080;
expressApp.listen(port, function () {
  console.info(`SERVICE RUNNING ON PORT ${port}`);
});
