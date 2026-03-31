import "dotenv/config"
import { PrismaClient } from "../prisma/generated/client"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = `${process.env.DB_URL_CONNECTION_STRING}`

const adapter = new PrismaPg({ connectionString })

export const db = globalThis.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
}