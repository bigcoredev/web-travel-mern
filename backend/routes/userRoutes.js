import express from 'express'
import { 
  registerUser,
  authUser,
  allUsers,
  GetUserById,
  updateProfile
} from '../controllers/userControllers.js'

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.route("/:id").get(GetUserById);
router.route("/update/:id").put(updateProfile);
router.post("/login", authUser);

export default router;
