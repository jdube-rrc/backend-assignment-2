import express, { Express } from "express";
import morgan from "morgan";

const app: Express = express();

app.use(express.json());
app.use(morgan("combined"));

app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

export default app;