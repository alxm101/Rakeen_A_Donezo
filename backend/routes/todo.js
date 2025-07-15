import express from "express";
import prisma from "../db/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: { userId: req.user.sub }
  });
  res.status(200).json({ success: true, todos });
});

router.post("/", async (req, res) => {
  const { name, description } = req.body;

  try {
    const newTodo = await prisma.todo.create({
      data: {
        name,
        description,
        completed: false,
        userId: req.user.sub
      }
    });

    res.status(201).json({ success: true, todo: newTodo.id });
  } catch (e) {
    res.status(500).json({ success: false, message: "Failed to create todo" });
  }
});

router.put("/:todoId/completed", async (req, res) => {
  const todoId = Number(req.params.todoId);

  try {
    const todo = await prisma.todo.update({
      where: { id: todoId },
      data: { completed: true }
    });

    res.status(200).json({ success: true, todo: todo.id });
  } catch (e) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

router.delete("/:todoId", async (req, res) => {
  const todoId = Number(req.params.todoId);

  try {
    const todo = await prisma.todo.findUnique({ where: { id: todoId } });

    if (!todo || !todo.completed) {
      return res.status(400).json({
        success: false,
        message: "Todo must be completed before deleting"
      });
    }

    await prisma.todo.delete({ where: { id: todoId } });

    res.status(200).json({ success: true, todo: todoId });
  } catch (e) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});

export default router;
