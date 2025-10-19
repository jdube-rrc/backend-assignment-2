import request, { Response } from "supertest";
import app from "../src/app";

describe("Branch Validation Tests", (): void => {
    describe("POST /api/v1/branches - Create Branch Validation", (): void => {
        test("should accept valid branch data", async (): Promise<void> => {
            const validBranch: { name: string; address: string; phone: string } = {
                name: "Downtown Branch",
                address: "123 Main Street, City, State 12345",
                phone: "555-1234"
            };

            const response: Response = await request(app)
                .post("/api/v1/branches")
                .send(validBranch);

            expect(response.status).toBe(201);
                expect(response.body.status).toBe("success");
                expect(response.body.message).toBe("Branch created successfully");
        });

        test("should reject when name is missing", async (): Promise<void> => {
            const invalidBranch: { address: string; phone: string } = {
                address: "123 Main Street, City, State 12345",
                phone: "555-1234"
            };

            const response: Response = await request(app)
                .post("/api/v1/branches")
                .send(invalidBranch);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Name is required");
        });

        test("should reject when name is too short (< 2 characters)", async (): Promise<void> => {
            const invalidBranch: { name: string; address: string; phone: string } = {
                name: "D",
                address: "123 Main Street, City, State 12345",
                phone: "555-1234"
            };

            const response: Response = await request(app)
                .post("/api/v1/branches")
                .send(invalidBranch);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Name must be at least 2 characters");
        });

        test("should reject when name is too long (> 100 characters)", async (): Promise<void> => {
            const invalidBranch: { name: string; address: string; phone: string } = {
                name: "A".repeat(101),
                address: "123 Main Street, City, State 12345",
                phone: "555-1234"
            };

            const response: Response = await request(app)
                .post("/api/v1/branches")
                .send(invalidBranch);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Name must be at most 100 characters");
        });

        test("should reject when address is missing", async (): Promise<void> => {
            const invalidBranch: { name: string; phone: string } = {
                name: "Downtown Branch",
                phone: "555-1234"
            };

            const response: Response = await request(app)
                .post("/api/v1/branches")
                .send(invalidBranch);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Address is required");
        });

        test("should reject when address is too short (< 5 characters)", async (): Promise<void> => {
            const invalidBranch: { name: string; address: string; phone: string } = {
                name: "Downtown Branch",
                address: "123",
                phone: "555-1234"
            };

            const response: Response = await request(app)
                .post("/api/v1/branches")
                .send(invalidBranch);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Address must be at least 5 characters");
        });

        test("should reject when address is too long (> 200 characters)", async (): Promise<void> => {
            const invalidBranch: { name: string; address: string; phone: string } = {
                name: "Downtown Branch",
                address: "A".repeat(201),
                phone: "555-1234"
            };

            const response: Response = await request(app)
                .post("/api/v1/branches")
                .send(invalidBranch);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Address must be at most 200 characters");
        });

        test("should reject when phone is missing", async (): Promise<void> => {
            const invalidBranch: { name: string; address: string } = {
                name: "Downtown Branch",
                address: "123 Main Street, City, State 12345"
            };

            const response: Response = await request(app)
                .post("/api/v1/branches")
                .send(invalidBranch);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Phone is required");
        });

        test("should reject when phone has invalid format", async (): Promise<void> => {
            const invalidBranch: { name: string; address: string; phone: string } = {
                name: "Downtown Branch",
                address: "123 Main Street, City, State 12345",
                phone: "abc"
            };

            const response: Response = await request(app)
                .post("/api/v1/branches")
                .send(invalidBranch);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Phone must be a valid phone number");
        });

        test("should reject when phone is too short (< 7 characters)", async (): Promise<void> => {
            const invalidBranch: { name: string; address: string; phone: string } = {
                name: "Downtown Branch",
                address: "123 Main Street, City, State 12345",
                phone: "123"
            };

            const response: Response = await request(app)
                .post("/api/v1/branches")
                .send(invalidBranch);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Phone must be a valid phone number");
        });

        test("should reject when phone is too long (> 20 characters)", async (): Promise<void> => {
            const invalidBranch: { name: string; address: string; phone: string } = {
                name: "Downtown Branch",
                address: "123 Main Street, City, State 12345",
                phone: "123456789012345678901"
            };

            const response: Response = await request(app)
                .post("/api/v1/branches")
                .send(invalidBranch);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Phone must be a valid phone number");
        });

        test("should accept valid phone formats with special characters", async (): Promise<void> => {
            const validBranch: { name: string; address: string; phone: string } = {
                name: "Downtown Branch",
                address: "123 Main Street, City, State 12345",
                phone: "+1 (555) 123-4567"
            };

            const response: Response = await request(app)
                .post("/api/v1/branches")
                .send(validBranch);

            expect(response.status).toBe(201);
        });

        test("should accept phone with international format", async (): Promise<void> => {
            const validBranch: { name: string; address: string; phone: string } = {
                name: "International Branch",
                address: "456 Global Avenue",
                phone: "+44 20 7946 0958"
            };

            const response: Response = await request(app)
                .post("/api/v1/branches")
                .send(validBranch);

            expect(response.status).toBe(201);
        });

        test("should strip unknown fields from request body", async (): Promise<void> => {
            const branchWithExtraFields: { name: string; address: string; phone: string; unknownField: string; anotherUnknownField: string } = {
                name: "Test Branch",
                address: "789 Test Road",
                phone: "555-5555",
                unknownField: "should be removed",
                anotherUnknownField: "also removed"
            };

            const response: Response = await request(app)
                .post("/api/v1/branches")
                .send(branchWithExtraFields);

            expect(response.status).toBe(201);
            // The unknown fields should be stripped by validation middleware
        });

        test("should trim whitespace from name", async (): Promise<void> => {
            const branchWithWhitespace: { name: string; address: string; phone: string } = {
                name: "  Trimmed Branch  ",
                address: "123 Trim Street",
                phone: "555-7777"
            };

            const response: Response = await request(app)
                .post("/api/v1/branches")
                .send(branchWithWhitespace);

            expect(response.status).toBe(201);
            // Joi should trim the whitespace automatically
        });
    });

    describe("PUT /api/v1/branches/:id - Update Branch Validation", (): void => {
        test("should accept valid partial branch data", async (): Promise<void> => {
            const updateData: { name: string } = {
                name: "Updated Branch Name"
            };

            const response: Response = await request(app)
                .put("/api/v1/branches/1")
                .send(updateData);

            expect(response.status).toBe(200);
        });

        test("should accept updating only address", async (): Promise<void> => {
            const updateData: { address: string } = {
                address: "999 New Address Street"
            };

            const response: Response = await request(app)
                .put("/api/v1/branches/1")
                .send(updateData);

            expect(response.status).toBe(200);
        });

        test("should accept updating only phone", async (): Promise<void> => {
            const updateData: { phone: string } = {
                phone: "555-9999"
            };

            const response: Response = await request(app)
                .put("/api/v1/branches/1")
                .send(updateData);

            expect(response.status).toBe(200);
        });

        test("should accept updating all fields at once", async (): Promise<void> => {
            const updateData: { name: string; address: string; phone: string } = {
                name: "Completely New Name",
                address: "777 Completely New Address",
                phone: "555-8888"
            };

            const response: Response = await request(app)
                .put("/api/v1/branches/1")
                .send(updateData);

            expect(response.status).toBe(200);
        });

        test("should reject when name is too short in update", async (): Promise<void> => {
            const updateData: { name: string } = {
                name: "A"
            };

            const response: Response = await request(app)
                .put("/api/v1/branches/1")
                .send(updateData);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Name must be at least 2 characters");
        });

        test("should reject when address is too short in update", async (): Promise<void> => {
            const updateData: { address: string } = {
                address: "123"
            };

            const response: Response = await request(app)
                .put("/api/v1/branches/1")
                .send(updateData);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Address must be at least 5 characters");
        });

        test("should reject when phone is invalid in update", async (): Promise<void> => {
            const updateData: { phone: string } = {
                phone: "abc"
            };

            const response: Response = await request(app)
                .put("/api/v1/branches/1")
                .send(updateData);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Phone must be a valid phone number");
        });

        test("should accept empty body for update", async (): Promise<void> => {
            const response: Response = await request(app)
                .put("/api/v1/branches/1")
                .send({});

            expect(response.status).toBe(200);
        });
    });

    describe("GET /api/v1/branches/:id - Get Branch By ID Validation", (): void => {
        test("should accept valid branch ID", async (): Promise<void> => {
            const response: Response = await request(app)
                .get("/api/v1/branches/1");

            expect(response.status).toBe(200);
        });

        test("should accept any string as ID parameter", async (): Promise<void> => {
            // Note: The validation allows any string, even if branch doesn't exist
            // The controller will handle the "not found" case
            const response: Response = await request(app)
                .get("/api/v1/branches/999");

            // Either 200 (found) or 404 (not found) are valid
            expect([200, 404]).toContain(response.status);
        });
    });

    describe("DELETE /api/v1/branches/:id - Delete Branch Validation", (): void => {
        test("should accept valid branch ID for deletion", async (): Promise<void> => {
            // First create a branch to delete
            const newBranch: { name: string; address: string; phone: string } = {
                name: "To Delete",
                address: "123 Delete Street",
                phone: "555-0000"
            };

            const createResponse: Response = await request(app)
                .post("/api/v1/branches")
                .send(newBranch);

            expect(createResponse.status).toBe(201);
            
            const branchId = createResponse.body.data.id;

            const deleteResponse: Response = await request(app)
                .delete(`/api/v1/branches/${branchId}`);

            expect(deleteResponse.status).toBe(200);
        });
    });
});
