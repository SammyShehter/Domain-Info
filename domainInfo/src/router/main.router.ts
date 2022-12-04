import express from "express"
import MainMiddleware from "../middlewares/main.middleware"
import MainController from "../controllers/main.controller"

export const router = express.Router()

router.get(
    "/",
    MainMiddleware.getReqChecks,
    MainController.getDomainInfo
)

router.post(
    "/",
    MainMiddleware.postReqChecks,
    MainController.addDomain
)
