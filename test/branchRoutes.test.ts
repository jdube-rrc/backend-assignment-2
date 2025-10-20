import request, { Response } from "supertest";
import app from "../src/app";
import { Branch } from "../src/data/branches";

describe("Branch Routes", (): void => {
    
    test("GET /api/v1/branches should call getAllBranches controller", async (): Promise<void> => {
        const response: Response = await request(app)
            .get("/api/v1/branches");
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status");
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test("GET /api/v1/branches/:id should call getBranchById controller", async (): Promise<void> => {
        const response: Response = await request(app)
            .get("/api/v1/branches/1");
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status");
        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toHaveProperty("id");
    });

    test("POST /api/v1/branches should call createBranch controller", async (): Promise<void> => {
        const newBranch: Omit<Branch, "id"> = {
            name: "Test Branch",
            address: "123 Test St",
            phone: "123-4567"
        };

        const response: Response = await request(app)
            .post("/api/v1/branches")
            .send(newBranch);
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("status");
        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toHaveProperty("id");
        expect(response.body.data.name).toBe("Test Branch");
    });

    test("PUT /api/v1/branches/:id should call updateBranch controller", async (): Promise<void> => {
        const newBranch: Omit<Branch, "id"> = {
            name: "Updated Branch",
            address: "123 Update Ave",
            phone: "123-4567"
        };

        const createResponse: Response = await request(app)
            .post("/api/v1/branches")
            .send(newBranch);

        const branchId: number = createResponse.body.data.id;
        const updateData: Partial<Omit<Branch, "id">> = {name: "Updated Branch Name"};

        const response: Response = await request(app)
            .put(`/api/v1/branches/${branchId}`)
            .send(updateData);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status");
        expect(response.body).toHaveProperty("data");
        expect(response.body.data.name).toBe("Updated Branch Name");
    });

    test("DELETE /api/v1/branches/:id should call deleteBranch controller", async (): Promise<void> => {
        const newBranch: Omit<Branch, "id"> = {
            name: "Delete Test Branch",
            address: "123 Delete Ave",
            phone: "123-4567"
        };

        const createResponse: Response = await request(app)
            .post("/api/v1/branches")
            .send(newBranch);

        const branchId: number = createResponse.body.data.id;
        const response: Response = await request(app)
            .delete(`/api/v1/branches/${branchId}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status");
            expect(response.body.status).toBe("success");
            expect(response.body.message).toContain("deleted successfully");
    });
});
