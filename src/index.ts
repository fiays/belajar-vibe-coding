import { Elysia } from "elysia";
import { db } from "./db";
import { users } from "./db/schema";

const app = new Elysia()
  .get("/", () => "Welcome to Elysia!")
  .get("/ping", () => "pong")
  .get("/users", async () => {
    try {
      return await db.select().from(users);
    } catch (e) {
      return { error: "Database connection failed or table not found" };
    }
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
