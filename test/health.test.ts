import request, { Response } from "supertest";
import app from "../src/app";

describe("GET /api/v1/health", () => {
  it("should return 200 OK and health info", async (): Promise<void> => {
    const response: Response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "OK");
    expect(response.body).toHaveProperty("uptime");
    expect(response.body).toHaveProperty("timestamp");
    expect(response.body).toHaveProperty("version", "1.0.0");
  });
});