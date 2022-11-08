import express from "express";

import posts from "./posts";
import auth from "./auth";

const router = express.Router();

router.use("/", auth);

router.use("/posts", posts);

export default router;
