import "dotenv/config";
import path from "path";
import type { PrismaConfig } from "prisma";

export default {
  schema: path.join("db"),
} satisfies PrismaConfig;
