import { model, Schema, Model, Document } from "mongoose";

interface IPost extends Document {
  title: string;
  content: string;
}

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const Post: Model<IPost> = model("Posts", PostSchema);

export { Post, IPost };
