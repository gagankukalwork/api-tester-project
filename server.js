import express from "express";
import axios from "axios";
import { MikroORM } from "@mikro-orm/core";
import config from "./mikro-orm.config.js";

async function startServer() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));

  // ✅ Connect to database
  const orm = await MikroORM.init(config);
  const em = orm.em.fork();

  // 🔹 Test route (check server + DB)
  app.get("/test", async (req, res) => {
    res.json({ message: "Server + DB working ✅" });
  });

  // 🔹 Main API forward + save to DB
  app.post("/request", async (req, res) => {
    try {
      const { method, url, body } = req.body;

      if (!method || !url) {
        return res.status(400).json({ error: "Method and URL required" });
      }

      // External API call
      const response = await axios({
        method,
        url,
        data: body,
      });

      // ✅ EntitySchema → use entity name as STRING
      const history = em.create("RequestHistory", {
        method,
        url,
        statusCode: response.status,
        timestamp: new Date(),
      });

      await em.persistAndFlush(history);

      res.json({
        status: response.status,
        data: response.data,
      });
    } catch (err) {
      console.error("BACKEND ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // 🔹 Fetch request history
  app.get("/history", async (req, res) => {
    const history = await em.find("RequestHistory", {});
    res.json(history);
  });

  // 🔹 Start server
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}

startServer().catch(err => {
  console.error("❌ Failed to start server:", err);
});
