import { currentUser } from "@mgktickets/common";
import express from "express";

const router = express.Router();

router.get("/api/users/currentUser", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

// we are renaming the router to avoid name collisions
export { router as currentUserRouter };
