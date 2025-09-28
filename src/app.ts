import express, { Express } from "express";
import morgan from "morgan";
import branchRoutes from "./api/v1/routes/branchRoutes";
import employeeRoutes from "./api/v1/routes/employeeRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app: Express = express();

app.use(express.json());
app.use(morgan("combined"));

app.use("/api/v1/branches", branchRoutes);
app.use("/api/v1/employees", employeeRoutes);

app.get("/api/v1/health", (req: express.Request, res: express.Response) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

app.use(errorHandler);

export default app;