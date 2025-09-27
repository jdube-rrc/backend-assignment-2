import request from "supertest";
import app from "../src/app";

describe("Branch Controller", () => {
    
    describe("getAllBranches", () => {
        test("should return 200 status and success message", async () => {
            const response = await request(app)
                .get("/api/v1/branches");
            
            expect(response.status).toBe(200);
            expect(response.body.status).toBe("Branch list retrieved successfully");
        });

        test("should return all branches without validation errors", async () => {
            const response = await request(app)
                .get("/api/v1/branches");
            
            expect(response.status).toBe(200);

            response.body.data.forEach((branch: any) => {
                expect(branch).toHaveProperty("id");
                expect(branch).toHaveProperty("name");
                expect(branch).toHaveProperty("address");
                expect(branch).toHaveProperty("phone");
            });
        });
    });

    describe("getBranchById", () => {
        test("should return 200 status and success message for valid ID", async () => {
            const response = await request(app)
                .get("/api/v1/branches/1");
            
            expect(response.status).toBe(200);
            expect(response.body.status).toBe("Branch retrieved successfully");
        });

        test("should return 404 status for non-existent branch ID", async () => {
            const response = await request(app)
                .get("/api/v1/branches/9999");
            
            expect(response.status).toBe(404);
            expect(response.body.status).toBe("error");
            expect(response.body.message).toContain("Branch with ID 9999 not found");
        });
    });

    describe("createBranch", () => {
        test("should return 201 status and success message for valid data", async () => {
            const newBranch = {
                name: "Test Branch",
                address: "123 Test Street",
                phone: "123-4567"
            };

            const response = await request(app)
                .post("/api/v1/branches")
                .send(newBranch);
            
            expect(response.status).toBe(201);
            expect(response.body.status).toBe("Branch created successfully");
        });

        test("should return 400 status for missing required fields", async () => {
            const invalidBranch1 = {
                address: "123 Test Street",
                phone: "123-4567"
            };

            const response1 = await request(app)
                .post("/api/v1/branches")
                .send(invalidBranch1);
            
            expect(response1.status).toBe(400);
            expect(response1.body.status).toBe("Branch name is required");

            // Test missing address
            const invalidBranch2 = {
                name: "Test Branch",
                phone: "123-4567"
            };

            const response2 = await request(app)
                .post("/api/v1/branches")
                .send(invalidBranch2);
            
            expect(response2.status).toBe(400);
            expect(response2.body.status).toBe("Branch address is required");

            // Test missing phone
            const invalidBranch3 = {
                name: "Test Branch",
                address: "123 Test Street"
            };

            const response3 = await request(app)
                .post("/api/v1/branches")
                .send(invalidBranch3);
            
            expect(response3.status).toBe(400);
            expect(response3.body.status).toBe("Branch phone is required");
        });
    });

    describe("updateBranch", () => {
        let createdBranchId: number;

        beforeEach(async () => {
            // Create a branch for testing updates
            const newBranch = {
                name: "Update Test Branch",
                address: "123 Update Street",
                phone: "123-4567"
            };

            const createResponse = await request(app)
                .post("/api/v1/branches")
                .send(newBranch);
            
            createdBranchId = createResponse.body.data.id;
        });

        test("should return 200 status and success message for valid update", async () => {
            const updateData = {
                name: "Updated Branch Name",
                phone: "123-4567"
            };

            const response = await request(app)
                .put(`/api/v1/branches/${createdBranchId}`)
                .send(updateData);
            
            expect(response.status).toBe(200);
            expect(response.body.status).toBe("Branch updated successfully");
        });

        test("should return 404 status for non-existent branch ID", async () => {
            const updateData = {
                name: "Updated Branch Name"
            };

            const response = await request(app)
                .put("/api/v1/branches/9999")
                .send(updateData);
            
            expect(response.status).toBe(404);
            expect(response.body.status).toBe("error");
            expect(response.body.message).toContain("Branch with ID 9999 not found");
        });
    });

    describe("deleteBranch", () => {
        let createdBranchId: number;

        beforeEach(async () => {
            const newBranch = {
                name: "Delete Test Branch",
                address: "123 Delete Street",
                phone: "123-4567"
            };

            const createResponse = await request(app)
                .post("/api/v1/branches")
                .send(newBranch);
            
            createdBranchId = createResponse.body.data.id;
        });

        test("should return 200 status and success message for valid deletion", async () => {
            const response = await request(app)
                .delete(`/api/v1/branches/${createdBranchId}`);
            
            expect(response.status).toBe(200);
            expect(response.body.status).toBe("Branch deleted successfully");

            const getResponse = await request(app)
                .get(`/api/v1/branches/${createdBranchId}`);
            expect(getResponse.status).toBe(404);
        });

        test("should return 404 status for non-existent branch ID", async () => {
            const response = await request(app)
                .delete("/api/v1/branches/9999");
            
            expect(response.status).toBe(404);
            expect(response.body.status).toBe("error");
            expect(response.body.message).toContain("Branch with ID 9999 not found");
        });
    });
});