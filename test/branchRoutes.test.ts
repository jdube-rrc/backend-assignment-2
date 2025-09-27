import request from "supertest";
import app from "../src/app";

describe("Branch Routes", () => {
    
    test("GET /api/v1/branches should call getAllBranches controller", async () => {
        const response = await request(app)
            .get("/api/v1/branches");
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status");
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test("GET /api/v1/branches/:id should call getBranchById controller", async () => {
        const response = await request(app)
            .get("/api/v1/branches/1");
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status");
        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toHaveProperty("id");
    });

    test("POST /api/v1/branches should call createBranch controller", async () => {
        const newBranch = {
            name: "Test Branch",
            address: "123 Test St",
            phone: "123-4567"
        };

        const response = await request(app)
            .post("/api/v1/branches")
            .send(newBranch);
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("status");
        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toHaveProperty("id");
        expect(response.body.data.name).toBe("Test Branch");
    });

    test("PUT /api/v1/branches/:id should call updateBranch controller", async () => {
        const newBranch = {
            name: "Updated Branch",
            address: "123 Update Ave",
            phone: "123-4567"
        };

        const createResponse = await request(app)
            .post("/api/v1/branches")
            .send(newBranch);

        const branchId = createResponse.body.data.id;
        const updateData = {name: "Updated Branch Name"};

        const response = await request(app)
            .put(`/api/v1/branches/${branchId}`)
            .send(updateData);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status");
        expect(response.body).toHaveProperty("data");
        expect(response.body.data.name).toBe("Updated Branch Name");
    });

    test("DELETE /api/v1/branches/:id should call deleteBranch controller", async () => {
        const newBranch = {
            name: "Delete Test Branch",
            address: "123 Delete Ave",
            phone: "123-4567"
        };

        const createResponse = await request(app)
            .post("/api/v1/branches")
            .send(newBranch);

        const branchId = createResponse.body.data.id;
        const response = await request(app)
            .delete(`/api/v1/branches/${branchId}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status");
        expect(response.body.status).toContain("deleted successfully");
    });
});
