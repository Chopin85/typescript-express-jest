import { Request, Response, NextFunction } from "express";
import { Post, IPost } from "../models/Post";

type ReqParams = {
  id: string;
};

type ResError = {
  error: String;
};

type ResDelete = {
  ok?: number | undefined;
  n?: number | undefined;
} & {
  deletedCount?: number | undefined;
};

const getPosts = async (
  req: Request<{}, {}, {}>,
  res: Response<IPost[]>,
  next: NextFunction
) => {
  const posts = await Post.find();
  return res.status(200).send(posts);
};

const getPost = async (
  req: Request<ReqParams, {}, {}>,
  res: Response<IPost | ResError>,
  next: NextFunction
) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    return res.status(200).send(post ? post : undefined);
  } catch {
    return res.status(404).send({ error: "Post doesn't exist!" });
  }
};

const postPost = async (
  req: Request<{}, {}, IPost>,
  res: Response<IPost>,
  next: NextFunction
) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  await post.save();
  return res.status(201).send(post);
};

const putPost = async (
  req: Request<ReqParams, {}, IPost>,
  res: Response<IPost | ResError>,
  next: NextFunction
) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (post) {
      if (req.body.title) {
        post.title = req.body.title;
      }
      if (req.body.content) {
        post.content = req.body.content;
      }
      await post.save();
      return res.status(200).send(post);
    }
  } catch {
    return res.status(404).send({ error: "Post doesn't exist!" });
  }
};

const deletePost = async (
  req: Request<ReqParams, {}, {}>,
  res: Response<ResDelete | ResError>,
  next: NextFunction
) => {
  try {
    const post = await Post.deleteOne({ _id: req.params.id });
    if (post.deletedCount) {
      if (post.deletedCount > 0) {
        return res.status(204).send(post);
      }
    } else {
      return res.status(404).send({ error: "Post doesn't exist!" });
    }
  } catch {
    return res.status(404).send({ error: "Post doesn't exist!" });
  }
};

export { getPosts, postPost, getPost, putPost, deletePost };
