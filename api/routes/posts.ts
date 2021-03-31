import { Router } from "express";

import {
  getPosts,
  postPost,
  getPost,
  putPost,
  deletePost,
} from "../controllers/postControllers";

const router = Router();

router.route("/").get(getPosts);
router.route("/").post(postPost);
router.route("/:id").get(getPost);
router.route("/:id").put(putPost);
router.route("/:id").delete(deletePost);

export { router as postsRoutes };
