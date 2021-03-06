const app = require("../../server");
const mongoose = require("mongoose");
const supertest = require("supertest");

import { Post, IPost } from "../../api/models/Post";

type ResponsePosts = {
  body: IPost[];
};

type ResponsePost = {
  body: IPost;
};

beforeEach((done) => {
  mongoose.connect(
    "mongodb://localhost:27017/JestDBTest",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

// Test endpoint 'posts'
describe('Test endpoint "/posts"', () => {
  test("GET /api/posts", async () => {
    const post = new Post({
      title: "Post 1",
      content: "Lorem ipsum",
    });
    await post.save();
    await supertest(app)
      .get("/api/posts")
      .expect(200)
      .then((response: ResponsePosts) => {
        // Check type and length
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(1);
        // Check data
        expect(response.body[0]._id).toBe(post.id);
        expect(response.body[0].title).toBe(post.title);
        expect(response.body[0].content).toBe(post.content);
      });
  });
  test("POST /api/posts", async () => {
    const data = { title: "Post 1", content: "Lorem ipsum" };
    await supertest(app)
      .post("/api/posts")
      .send(data)
      .expect(201)
      .then(async (response: ResponsePost) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
        expect(response.body.title).toBe(data.title);
        expect(response.body.content).toBe(data.content);
        // Check data in the database
        const post = await Post.findOne({ _id: response.body._id });
        expect(post).toBeTruthy();
        expect(post?.title).toBe(data.title);
        expect(post?.content).toBe(data.content);
      });
  });
  test("GET /api/posts/:id", async () => {
    const post = new Post({
      title: "Post 1",
      content: "Lorem ipsum",
    });
    await post.save();
    await supertest(app)
      .get("/api/posts/" + post.id)
      .expect(200)
      .then((response: ResponsePost) => {
        expect(response.body._id).toBe(post.id);
        expect(response.body.title).toBe(post.title);
        expect(response.body.content).toBe(post.content);
      });
  });
  test("PUT /api/posts/:id", async () => {
    const post = new Post({
      title: "Post 1",
      content: "Lorem ipsum",
    });
    await post.save();
    const data = { title: "New title", content: "dolor sit amet" };
    await supertest(app)
      .put("/api/posts/" + post.id)
      .send(data)
      .expect(200)
      .then(async (response: ResponsePost) => {
        // Check the response
        expect(response.body._id).toBe(post.id);
        expect(response.body.title).toBe(data.title);
        expect(response.body.content).toBe(data.content);
        // Check the data in the database
        const newPost = await Post.findOne({ _id: response.body._id });
        expect(newPost).toBeTruthy();
        expect(newPost?.title).toBe(data.title);
        expect(newPost?.content).toBe(data.content);
      });
  });
  test("DELETE /api/posts/:id", async () => {
    const post = new Post({
      title: "Post 1",
      content: "Lorem ipsum",
    });
    await post.save();
    await supertest(app)
      .delete("/api/posts/" + post.id)
      .expect(204)
      .then(async () => {
        expect(await Post.findOne({ _id: post.id })).toBeFalsy();
      });
  });
});
