import request, { Response } from "supertest";
import app from "../src/app";
import { Branch } from "../src/data/branches";

describe("Branch Controller", () => {
    
    describe("getAllBranches", () => {
        test("should return 200 status and success message", async (): Promise<void> => {
            const response: Response = await request(app)
                .get("/api/v1/branches");
            
            expect(response.status).toBe(200);
            expect(response.body.status).toBe("Branch list retrieved successfully");
        });

        test("should return all branches without validation errors", async (): Promise<void> => {
            const response: Response = await request(app)
                .get("/api/v1/branches");
            
            expect(response.status).toBe(200);

            response.body.data.forEach((branch: Branch) => {
                expect(branch).toHaveProperty("id");
                expect(branch).toHaveProperty("name");
                expect(branch).toHaveProperty("address");
                expect(branch).toHaveProperty("phone");
            });
        });
    });

    describe("getBranchById", () => {
        test("should return 200 status and success message for valid ID", async (): Promise<void> => {
            const response: Response = await request(app)
                .get("/api/v1/branches/1");
            
            expect(response.status).toBe(200);
            expect(response.body.status).toBe("Branch retrieved successfully");
        });

        test("should return 404 status for non-existent branch ID", async (): Promise<void> => {
            const response: Response = await request(app)
                .get("/api/v1/branches/9999");
            
            expect(response.status).toBe(404);
            expect(response.body.status).toBe("error");
            expect(response.body.message).toContain("Branch with ID 9999 not found");
        });
    });

    describe("createBranch", () => {
        test("should return 201 status and success message for valid data", async (): Promise<void> => {
            const newBranch: Omit<Branch, "id"> = {
                name: "Test Branch",
                address: "123 Test Street",
                phone: "123-4567"
            };

            const response: Response = await request(app)
                .post("/api/v1/branches")
                .send(newBranch);
            
            expect(response.status).toBe(201);
            expect(response.body.status).toBe("Branch created successfully");
        });

        test("should return 400 status for missing required fields", async (): Promise<void> => {
            const invalidBranch1: Partial<Omit<Branch, "id">> = {
                address: "123 Test Street",
                phone: "123-4567"
            };

            const response1: Response = await request(app)
                .post("/api/v1/branches")
                .send(invalidBranch1);
            
            expect(response1.status).toBe(400);
            expect(response1.body.status).toBe("Branch name is required");

            // Test missing address
            const invalidBranch2: Partial<Omit<Branch, "id">> = {
                name: "Test Branch",
                phone: "123-4567"
            };

            const response2: Response = await request(app)
                .post("/api/v1/branches")
                .send(invalidBranch2);
            
            expect(response2.status).toBe(400);
            expect(response2.body.status).toBe("Branch address is required");

            // Test missing phone
            const invalidBranch3: Partial<Omit<Branch, "id">> = {
                name: "Test Branch",
                address: "123 Test Street"
            };

            const response3: Response = await request(app)
                .post("/api/v1/branches")
                .send(invalidBranch3);
            
            expect(response3.status).toBe(400);
            expect(response3.body.status).toBe("Branch phone is required");
        });
    });

    describe("updateBranch", () => {
        let createdBranchId: number;

        beforeEach(async (): Promise<void> => {
            // Create a branch for testing updates
            const newBranch: Omit<Branch, "id"> = {
                name: "Update Test Branch",
                address: "123 Update Street",
                phone: "123-4567"
            };

            const createResponse: Response = await request(app)
                .post("/api/v1/branches")
                .send(newBranch);
            
            createdBranchId = createResponse.body.data.id;
        });

        test("should return 200 status and success message for valid update", async (): Promise<void> => {
            const updateData: Partial<Omit<Branch, "id">> = {
                name: "Updated Branch Name",
                phone: "123-4567"
            };

            const response: Response = await request(app)
                .put(`/api/v1/branches/${createdBranchId}`)
                .send(updateData);
            
            expect(response.status).toBe(200);
            expect(response.body.status).toBe("Branch updated successfully");
        });

        test("should return 404 status for non-existent branch ID", async (): Promise<void> => {
            const updateData: Partial<Omit<Branch, "id">> = {
                name: "Updated Branch Name"
            };

            const response: Response = await request(app)
                .put("/api/v1/branches/9999")
                .send(updateData);
            
            expect(response.status).toBe(404);
            expect(response.body.status).toBe("error");
            expect(response.body.message).toContain("Branch with ID 9999 not found");
        });
    });

    describe("deleteBranch", () => {
        let createdBranchId: number;

        beforeEach(async (): Promise<void> => {
            const newBranch: Omit<Branch, "id"> = {
                name: "Delete Test Branch",
                address: "123 Delete Street",
                phone: "123-4567"
            };

            const createResponse: Response = await request(app)
                .post("/api/v1/branches")
                .send(newBranch);
            
            createdBranchId = createResponse.body.data.id;
        });

        test("should return 200 status and success message for valid deletion", async (): Promise<void> => {
            const response: Response = await request(app)
                .delete(`/api/v1/branches/${createdBranchId}`);
            
            expect(response.status).toBe(200);
            expect(response.body.status).toBe("Branch deleted successfully");

            const getResponse: Response = await request(app)
                .get(`/api/v1/branches/${createdBranchId}`);
            expect(getResponse.status).toBe(404);
        });

        test("should return 404 status for non-existent branch ID", async (): Promise<void> => {
            const response: Response = await request(app)
                .delete("/api/v1/branches/9999");
            
            expect(response.status).toBe(404);
            expect(response.body.status).toBe("error");
            expect(response.body.message).toContain("Branch with ID 9999 not found");
        });
    });
});