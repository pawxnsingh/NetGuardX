// this is the main router which will be use route all the request to different routes
import express from "express";
// create a router in express
const router = express.Router()

router.use("/admin",adminRouter)
router.use("/collectlogs",logRouter)

export default router;

