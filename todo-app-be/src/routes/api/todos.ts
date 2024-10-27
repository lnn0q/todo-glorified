import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
const router = express.Router();

const prisma = new PrismaClient();

// interface TodoData {
//   _id: number;
//   todo: string;
//   urgency: number;
// }

// let todoData: TodoData[];

// todoData = require("../../models/todos.json");

router
  .route("/")
  .get(async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany();
    res.json(todos);
    console.dir(todos);
  })
  .post(async (req: Request, res: Response) => {
    await prisma.todo.create({
      data: {
        todo: req.body.todo,
        urgency: req.body.urgency,
      },
    });
    console.log("Todo added:");
    console.dir(req.body);
    res.json(req.body);
  })
  .put(async (req: Request, res: Response) => {
    await prisma.todo.update({
      where: {
        id: req.body.id,
      },
      data: {
        todo: req.body.todo,
        urgency: req.body.urgency,
      },
    });
    console.log("Todo updated:");
    console.dir(req.body);
    res.json(req.body);
  })
  .delete(async (req: Request, res: Response) => {
    await prisma.todo.delete({
      where: {
        id: req.body.id,
      },
    });
    res.json(req.body);
  });

module.exports = router;
