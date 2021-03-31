import express, { Request, Response } from "express";
const { router } = require("./api/api");

const app = express();
app.use(express.json());
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello").status(200);
});

module.exports = app;
