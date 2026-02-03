import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { RequestHistory } from "./entities/RequestHistory.js";

export default {
  entities: [RequestHistory],
  dbName: "apitester",
  user: "postgres",
  password: "itsME@001212",
  host: "localhost",
  port: 5432,
  driver: PostgreSqlDriver,


  debug: true,
  allowGlobalContext: true,
};
