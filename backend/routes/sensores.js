import express from "express";
import { registrarSom } from "../controllers/sensorController.js";

const router = express.Router();
router.post("/", registrarSom);

export default router;
