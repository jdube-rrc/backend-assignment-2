import request, { Response } from "supertest";
import app from "../src/app";

describe("Employee Validation Tests", () => {
    describe("POST /api/v1/employees - Create Employee Validation", () => {
        test("should accept valid employee data", async (): Promise<void> => {
            const validEmployee = {
                name: "John Doe",
                position: "Software Engineer",
                department: "Engineering",
                email: "john.doe@example.com",
                phone: "555-1234",
                branchId: 1
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(validEmployee);

            expect(response.status).toBe(201);
                expect(response.body.status).toBe("success");
                expect(response.body.message).toBe("Employee created successfully");
        });

        test("should reject when name is missing", async (): Promise<void> => {
            const invalidEmployee = {
                position: "Software Engineer",
                department: "Engineering",
                email: "john.doe@example.com",
                phone: "555-1234",
                branchId: 1
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Name is required");
        });

        test("should reject when name is too short (< 2 characters)", async (): Promise<void> => {
            const invalidEmployee = {
                name: "J",
                position: "Software Engineer",
                department: "Engineering",
                email: "john.doe@example.com",
                phone: "555-1234",
                branchId: 1
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Name must be at least 2 characters");
        });

        test("should reject when name is too long (> 100 characters)", async (): Promise<void> => {
            const invalidEmployee = {
                name: "A".repeat(101),
                position: "Software Engineer",
                department: "Engineering",
                email: "john.doe@example.com",
                phone: "555-1234",
                branchId: 1
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Name must be at most 100 characters");
        });

        test("should reject when position is missing", async (): Promise<void> => {
            const invalidEmployee = {
                name: "John Doe",
                department: "Engineering",
                email: "john.doe@example.com",
                phone: "555-1234",
                branchId: 1
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Position is required");
        });

        test("should reject when position is too short (< 2 characters)", async (): Promise<void> => {
            const invalidEmployee = {
                name: "John Doe",
                position: "D",
                department: "Engineering",
                email: "john.doe@example.com",
                phone: "555-1234",
                branchId: 1
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Position must be at least 2 characters");
        });

        test("should reject when position is too long (> 100 characters)", async (): Promise<void> => {
            const invalidEmployee = {
                name: "John Doe",
                position: "A".repeat(101),
                department: "Engineering",
                email: "john.doe@example.com",
                phone: "555-1234",
                branchId: 1
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Position must be at most 100 characters");
        });

        test("should reject when department is missing", async (): Promise<void> => {
            const invalidEmployee = {
                name: "John Doe",
                position: "Software Engineer",
                email: "john.doe@example.com",
                phone: "555-1234",
                branchId: 1
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Department is required");
        });

        test("should reject when department is too short (< 2 characters)", async (): Promise<void> => {
            const invalidEmployee = {
                name: "John Doe",
                position: "Software Engineer",
                department: "I",
                email: "john.doe@example.com",
                phone: "555-1234",
                branchId: 1
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Department must be at least 2 characters");
        });

        test("should reject when department is too long (> 100 characters)", async (): Promise<void> => {
            const invalidEmployee = {
                name: "John Doe",
                position: "Software Engineer",
                department: "A".repeat(101),
                email: "john.doe@example.com",
                phone: "555-1234",
                branchId: 1
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Department must be at most 100 characters");
        });

        test("should reject when email is missing", async (): Promise<void> => {
            const invalidEmployee = {
                name: "John Doe",
                position: "Software Engineer",
                department: "Engineering",
                phone: "555-1234",
                branchId: 1
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Email is required");
        });

        test("should reject when email is invalid format", async (): Promise<void> => {
            const invalidEmployee = {
                name: "John Doe",
                position: "Software Engineer",
                department: "Engineering",
                email: "not-an-email",
                phone: "555-1234",
                branchId: 1
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Email must be a valid email");
        });

        test("should reject when phone is missing", async (): Promise<void> => {
            const invalidEmployee = {
                name: "John Doe",
                position: "Software Engineer",
                department: "Engineering",
                email: "john.doe@example.com",
                branchId: 1
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Phone is required");
        });

        test("should reject when phone has invalid format", async (): Promise<void> => {
            const invalidEmployee = {
                name: "John Doe",
                position: "Software Engineer",
                department: "Engineering",
                email: "john.doe@example.com",
                phone: "abc",
                branchId: 1
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Phone must be a valid phone number");
        });

        test("should reject when phone is too short (< 7 characters)", async (): Promise<void> => {
            const invalidEmployee = {
                name: "John Doe",
                position: "Software Engineer",
                department: "Engineering",
                email: "john.doe@example.com",
                phone: "123",
                branchId: 1
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Phone must be a valid phone number");
        });

        test("should reject when phone is too long (> 20 characters)", async (): Promise<void> => {
            const invalidEmployee = {
                name: "John Doe",
                position: "Software Engineer",
                department: "Engineering",
                email: "john.doe@example.com",
                phone: "123456789012345678901",
                branchId: 1
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Phone must be a valid phone number");
        });

        test("should accept valid phone formats with special characters", async (): Promise<void> => {
            const validEmployee = {
                name: "John Doe",
                position: "Software Engineer",
                department: "Engineering",
                email: "john.doe@example.com",
                phone: "+1 (555) 123-4567",
                branchId: 1
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(validEmployee);

            expect(response.status).toBe(201);
        });

        test("should reject when branchId is missing", async (): Promise<void> => {
            const invalidEmployee = {
                name: "John Doe",
                position: "Software Engineer",
                department: "Engineering",
                email: "john.doe@example.com",
                phone: "555-1234"
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("branchId is required");
        });

        test("should reject when branchId is not a number", async (): Promise<void> => {
            const invalidEmployee = {
                name: "John Doe",
                position: "Software Engineer",
                department: "Engineering",
                email: "john.doe@example.com",
                phone: "555-1234",
                branchId: "not-a-number"
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("branchId must be a number");
        });

        test("should reject when branchId is not an integer", async (): Promise<void> => {
            const invalidEmployee = {
                name: "John Doe",
                position: "Software Engineer",
                department: "Engineering",
                email: "john.doe@example.com",
                phone: "555-1234",
                branchId: 1.5
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("branchId must be an integer");
        });

        test("should reject when branchId is not positive", async (): Promise<void> => {
            const invalidEmployee = {
                name: "John Doe",
                position: "Software Engineer",
                department: "Engineering",
                email: "john.doe@example.com",
                phone: "555-1234",
                branchId: -1
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("branchId must be a positive number");
        });

        test("should strip unknown fields from request body", async (): Promise<void> => {
            const employeeWithExtraFields = {
                name: "John Doe",
                position: "Software Engineer",
                department: "Engineering",
                email: "john.doe@example.com",
                phone: "555-1234",
                branchId: 1,
                unknownField: "should be removed",
                anotherUnknownField: "also removed"
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(employeeWithExtraFields);

            expect(response.status).toBe(201);
            // The unknown fields should be stripped by validation middleware
        });
    });

    describe("PUT /api/v1/employees/:id - Update Employee Validation", () => {
        test("should accept valid partial employee data", async (): Promise<void> => {
            const updateData = {
                name: "Jane Doe",
                position: "Senior Engineer"
            };

            const response: Response = await request(app)
                .put("/api/v1/employees/1")
                .send(updateData);

            expect(response.status).toBe(200);
        });

        test("should reject when name is too short in update", async (): Promise<void> => {
            const updateData = {
                name: "J"
            };

            const response: Response = await request(app)
                .put("/api/v1/employees/1")
                .send(updateData);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Name must be at least 2 characters");
        });

        test("should reject when email is invalid in update", async (): Promise<void> => {
            const updateData = {
                email: "invalid-email"
            };

            const response: Response = await request(app)
                .put("/api/v1/employees/1")
                .send(updateData);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Email must be a valid email");
        });

        test("should accept empty body for update", async (): Promise<void> => {
            const response: Response = await request(app)
                .put("/api/v1/employees/1")
                .send({});

            expect(response.status).toBe(200);
        });
    });

    describe("GET /api/v1/employees/:id - Get Employee By ID Validation", () => {
        test("should accept valid employee ID", async (): Promise<void> => {
            const response: Response = await request(app)
                .get("/api/v1/employees/1");

            expect(response.status).toBe(200);
        });

        test("should accept any string as ID parameter", async (): Promise<void> => {
            // Note: The validation allows any string, even if employee doesn't exist
            // The controller will handle the "not found" case
            const response: Response = await request(app)
                .get("/api/v1/employees/999");

            // Either 200 (found) or 404 (not found) are valid
            expect([200, 404]).toContain(response.status);
        });
    });

    describe("GET /api/v1/employees/branch/:id - Get Employees By Branch Validation", () => {
        test("should accept valid branch ID", async (): Promise<void> => {
            const response: Response = await request(app)
                .get("/api/v1/employees/branch/1");

            expect(response.status).toBe(200);
        });
    });

    describe("GET /api/v1/employees/department/:department - Get Employees By Department Validation", () => {
        test("should accept valid department name", async (): Promise<void> => {
            const response: Response = await request(app)
                .get("/api/v1/employees/department/Management");

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("data");
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe("DELETE /api/v1/employees/:id - Delete Employee Validation", () => {
        test("should accept valid employee ID for deletion", async (): Promise<void> => {
            // First create an employee to delete
            const newEmployee = {
                name: "To Delete",
                position: "Temporary",
                department: "Test",
                email: "delete@example.com",
                phone: "555-9999",
                branchId: 1
            };

            const createResponse: Response = await request(app)
                .post("/api/v1/employees")
                .send(newEmployee);

            expect(createResponse.status).toBe(201);
            
            const employeeId = createResponse.body.data.id;

            const deleteResponse: Response = await request(app)
                .delete(`/api/v1/employees/${employeeId}`);

            expect(deleteResponse.status).toBe(200);
        });
    });
});
