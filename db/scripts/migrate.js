import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });
import { migrate } from "postgres-migrations";

async function run() {
  const dbConfig = {
    database: process.env.PG_NAME,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    ssl: {
      rejectUnauthorized: false,
    },
  };

  console.log("Connecting with config:", {
    ...dbConfig,
    password: "***",
  });

  await migrate(dbConfig, "./migrations");
}

run().catch(console.error);
