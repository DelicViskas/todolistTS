import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function todos(request: NextApiRequest, response: NextApiResponse) {
  response.setHeader("Content-Type", "application/json; charset=utf-8;");
  console.log(request.query);

  try {
    switch (request.method) {
      case 'GET':
        const rows = await prisma.todos.findMany();
        response.status(200).json(rows);
        break;

      case 'POST': {
        const text = request.body.text;
        if (!text) {
          response.status(400).send("Missing 'text' in request");
          return;
        }
        const newTodo = await prisma.todos.create({ data: { text } });
        response.status(201).json(newTodo);
        break;
      }

      case 'DELETE': {
        const id: number | undefined = Number(request.query?.id);

        if (!id) {
          response.status(400).send("Missing 'id' in request");
          return;
        }
        const delTodo = await prisma.todos.delete({ where: { id } });
        response.status(200).json(delTodo);
        break;
      }
    }
  } catch (error) {
    console.error("Error processing request:", error);
    response.status(500).send("Internal Server Error");
  }
}
