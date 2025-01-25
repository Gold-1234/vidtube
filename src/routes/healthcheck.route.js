import { Router } from "express";
import { healthcheck } from "../controllers/healthCheck.controllers.js";

const healthCheckRouter = Router()

healthCheckRouter.route("/").get(healthcheck)

export default healthCheckRouter
