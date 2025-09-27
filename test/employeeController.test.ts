import request from "supertest";
import app from "../src/app";

describe("Employee Controller", () => {
    
    describe("getAllEmployees", () => {
        test("should return 200 status and success message", async () => {
            const response = await request(app)
                .get("/api/v1/employees");
            
            expect(response.status).toBe(200);
            expect(response.body.status).toBe("Employee list retrieved successfully");
        });

        test("should return all employees without validation errors", async () => {
            const response = await request(app)
                .get("/api/v1/employees");
            
            expect(response.status).toBe(200);
            expect(response.body.data.length).toBeGreaterThan(0);

            response.body.data.forEach((employee: any) => {
                expect(employee).toHaveProperty('id');
                expect(employee).toHaveProperty('name');
                expect(employee).toHaveProperty('position');
                expect(employee).toHaveProperty('department');
                expect(employee).toHaveProperty('email');
                expect(employee).toHaveProperty('phone');
                expect(employee).toHaveProperty('branchId');
            });
        });
    });

    describe("getEmployeeById", () => {
        test("should return 200 status and success message for valid ID", async () => {
            const response = await request(app)
                .get("/api/v1/employees/1");
            
            expect(response.status).toBe(200);
            expect(response.body.status).toBe("Employee retrieved successfully");
        });

        test("should return 404 status for non-existent employee ID", async () => {
            const response = await request(app)
                .get("/api/v1/employees/9999");
            
            expect(response.status).toBe(404);
            expect(response.body.status).toBe("error");
            expect(response.body.message).toContain("Employee with ID 9999 not found");
        });
    });

    describe("getEmployeesByBranch", () => {
        test("should return 200 status and employees for valid branch ID", async () => {
            const response = await request(app)
                .get("/api/v1/employees/branch/1");
            
            expect(response.status).toBe(200);
            expect(response.body.status).toBe("Employees retrieved successfully");
        });

        test("should return empty array for branch with no employees", async () => {
            const response = await request(app)
                .get("/api/v1/employees/branch/9999");
            
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
        });
    });

    describe("getEmployeesByDepartment", () => {
        test("should return 200 status and employees for valid department", async () => {
            const response = await request(app)
                .get("/api/v1/employees/department/IT");
            
            expect(response.status).toBe(200);
            expect(response.body.status).toBe("Employees retrieved successfully");

            response.body.data.forEach((employee: any) => {
                expect(employee.department.toLowerCase()).toBe('it');
            });
        });

        test("should return empty array for non-existent department", async () => {
            const response = await request(app)
                .get("/api/v1/employees/department/NonExistentDept");
            
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
        });
    });

    describe("createEmployee", () => {
        test("should return 201 status and success message for valid data", async () => {
            const newEmployee = {
                name: "Test Employee",
                position: "Test Position",
                department: "Testing",
                email: "test@pixell-river.com",
                phone: "123-4567",
                branchId: 1
            };

            const response = await request(app)
                .post("/api/v1/employees")
                .send(newEmployee);
            
            expect(response.status).toBe(201);
            expect(response.body.status).toBe("Employee created successfully");
        });

        // this is so ugly but i couldn't come up with anything better
        test("should return 400 status for missing required fields", async () => {
            const invalidEmployee1 = {
                name: "Test Employee"
            };

            const response1 = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee1);
            
            expect(response1.status).toBe(400);
            expect(response1.body.status).toBe("Employee position is required");

            const invalidEmployee2 = {
                name: "Test Employee",
                position: "Test Position"
            };

            const response2 = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee2);
            
            expect(response2.status).toBe(400);
            expect(response2.body.status).toBe("Employee department is required");

            const invalidEmployee3 = {
                name: "Test Employee",
                position: "Test Position",
                department: "Testing"
            };

            const response3 = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee3);
            
            expect(response3.status).toBe(400);
            expect(response3.body.status).toBe("Employee email is required");

            const invalidEmployee4 = {
                name: "Test Employee",
                position: "Test Position",
                department: "Testing",
                email: "test@example.com"
            };

            const response4 = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee4);
            
            expect(response4.status).toBe(400);
            expect(response4.body.status).toBe("Employee phone is required");

            const invalidEmployee5 = {
                name: "Test Employee",
                position: "Test Position",
                department: "Testing",
                email: "test@example.com",
                phone: "123-4567"
            };

            const response5 = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee5);
            
            expect(response5.status).toBe(400);
            expect(response5.body.status).toBe("Employee branchId is required");

            const invalidEmployee6 = {
                position: "Test Position",
                department: "Testing",
                email: "test@example.com",
                phone: "123-4567",
                branchId: 1
            };

            const response6 = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee6);
            
            expect(response6.status).toBe(400);
            expect(response6.body.status).toBe("Employee name is required");
        });
    });

    describe("updateEmployee", () => {
        let createdEmployeeId: number;

        beforeEach(async () => {
            const newEmployee = {
                name: "Update Test Employee",
                position: "Test Position",
                department: "Testing",
                email: "update@test.com",
                phone: "123-4567",
                branchId: 1
            };

            const createResponse = await request(app)
                .post("/api/v1/employees")
                .send(newEmployee);
            
            createdEmployeeId = createResponse.body.data.id;
        });

        test("should return 200 status and success message for valid update", async () => {
            const updateData = {
                name: "Updated Employee Name",
                phone: "123-4567"
            };

            const response = await request(app)
                .put(`/api/v1/employees/${createdEmployeeId}`)
                .send(updateData);
            
            expect(response.status).toBe(200);
            expect(response.body.status).toBe("Employee updated successfully");
        });

        test("should return 404 status for non-existent employee ID", async () => {
            const updateData = {
                name: "Updated Employee Name"
            };

            const response = await request(app)
                .put("/api/v1/employees/9999")
                .send(updateData);
            
            expect(response.status).toBe(404);
            expect(response.body.status).toBe("error");
            expect(response.body.message).toContain("Employee with ID 9999 not found");
        });
    });

    describe("deleteEmployee", () => {
        let createdEmployeeId: number;

        beforeEach(async () => {
            const newEmployee = {
                name: "Delete Test Employee",
                position: "Test Position",
                department: "Testing",
                email: "delete@test.com",
                phone: "123-4567",
                branchId: 1
            };

            const createResponse = await request(app)
                .post("/api/v1/employees")
                .send(newEmployee);
            
            createdEmployeeId = createResponse.body.data.id;
        });

        test("should return 200 status and success message for valid deletion", async () => {
            const response = await request(app)
                .delete(`/api/v1/employees/${createdEmployeeId}`);
            
            expect(response.status).toBe(200);
            expect(response.body.status).toBe("Employee deleted successfully");

            const getResponse = await request(app)
                .get(`/api/v1/employees/${createdEmployeeId}`);
            expect(getResponse.status).toBe(404);
        });

        test("should return 404 status for non-existent employee ID", async () => {
            const response = await request(app)
                .delete("/api/v1/employees/9999");
            
            expect(response.status).toBe(404);
            expect(response.body.status).toBe("error");
            expect(response.body.message).toContain("Employee with ID 9999 not found");
        });
    });
});