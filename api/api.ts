import { Router } from "express";
import { postsRoutes } from "./routes/posts";

const router = Router();

router.use("/posts", postsRoutes);
// router.use('/sirups', sirupsRoutes)

export { router };
