import { getSubAccountsByUsername, updateSubAccount } from "../controllers/subAccountController.js";
import express from "express";

const router = express.Router();

router.get("/bus/:username", getSubAccountsByUsername);

// PUT /api/subaccounts/update/:id
router.put("/update/:id", updateSubAccount);
export default router;