require('dotenv').config()
import 'reflect-metadata';
import requestLogger from "./request-logger";
import express from 'express';
import healthController from "./health-controller";
import auth0middlewares from "./auth/auth-middleware";
import taskController from "./task/task-controller";
import mongoRepo from "./mongo";


mongoRepo.init();

const expressApp = express();
expressApp.use(requestLogger)
expressApp.use(auth0middlewares);
expressApp.get("/health", healthController)
expressApp.use(express.json())
expressApp.use("/rest/tasks/", taskController.router)


const port = process.env.PORT || 8080;
expressApp.listen(port, function () {
  console.info(`SERVICE RUNNING ON PORT ${port}`);
});
