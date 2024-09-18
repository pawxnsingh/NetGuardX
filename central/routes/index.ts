// this is the main router which will be use route all the request to different routes
import express from "express";
import adminRouter from "./admin";
import logRouter from "./logs";
// create a router in express
const router = express.Router();
// add different router related to all the services that a central sever will offer
router.use("/admin", adminRouter);



router.use("/collectlogs", logRouter);

export default router;
