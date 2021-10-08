import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  req.session = null;
  res.send({});
});

// we are renaming the router to avoid name collisions
export { router as signoutRouter };
