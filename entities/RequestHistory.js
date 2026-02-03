import { EntitySchema } from "@mikro-orm/core";

export const RequestHistory = new EntitySchema({
  name: "RequestHistory",
  tableName: "request_history",
  properties: {
    id: { type: "number", primary: true },
    method: { type: "string" },
    url: { type: "string" },
    statusCode: { type: "number", fieldName: "status_code" },
    timestamp: { type: "Date", defaultRaw: "now()" },
  },
});
