// this will have all the stuff related to the admin such as loggin and logout
import express from "express";
import {
  adminLoginController,
  adminSignupController,
} from "../controllers/adminAuthController";

const router = express.Router();

// /api/v1/admin
router.get("/login", adminLoginController);
router.post("/signup", adminSignupController);

export default router;
