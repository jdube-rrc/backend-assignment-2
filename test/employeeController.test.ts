import request, { Response } from "supertest";
import app from "../src/app";
import { Employee } from "../src/data/employees";

describe("Employee Controller", (): void => {
    
    describe("getAllEmployees", (): void => {
        test("should return 200 status and success message", async (): Promise<void> => {
            const response: Response = await request(app)
                .get("/api/v1/employees");
            
            expect(response.status).toBe(200);
                expect(response.body.status).toBe("success");
                expect(response.body.message).toBe("Employee list retrieved successfully");
        });

        test("should return all employees without validation errors", async (): Promise<void> => {
            const response: Response = await request(app)
                .get("/api/v1/employees");
            
            expect(response.status).toBe(200);
            expect(response.body.data.length).toBeGreaterThan(0);

            response.body.data.forEach((employee: Employee) => {
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

    describe("getEmployeeById", (): void => {
        test("should return 200 status and success message for valid ID", async (): Promise<void> => {
            const response: Response = await request(app)
                .get("/api/v1/employees/1");
            
            expect(response.status).toBe(200);
                expect(response.body.status).toBe("success");
                expect(response.body.message).toBe("Employee retrieved successfully");
        });

        test("should return 404 status for non-existent employee ID", async (): Promise<void> => {
            const response: Response = await request(app)
                .get("/api/v1/employees/9999");
            
            expect(response.status).toBe(404);
            expect(response.body.status).toBe("error");
            expect(response.body.message).toContain("Employee with ID 9999 not found");
        });
    });

    describe("getEmployeesByBranch", (): void => {
        test("should return 200 status and employees for valid branch ID", async (): Promise<void> => {
            const response: Response = await request(app)
                .get("/api/v1/employees/branch/1");
            
            expect(response.status).toBe(200);
                expect(response.body.status).toBe("success");
                expect(response.body.message).toBe("Employees retrieved successfully");
        });

        test("should return empty array for branch with no employees", async (): Promise<void> => {
            const response: Response = await request(app)
                .get("/api/v1/employees/branch/9999");
            
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
        });
    });

    describe("getEmployeesByDepartment", (): void => {
        test("should return 200 status and success message for valid department", async (): Promise<void> => {
            const response: Response = await request(app)
                .get("/api/v1/employees/department/IT");
            
            expect(response.status).toBe(200);
                expect(response.body.status).toBe("success");
                expect(response.body.message).toBe("Employees retrieved successfully");

            response.body.data.forEach((employee: Employee) => {
                expect(employee.department.toLowerCase()).toBe('it');
            });
        });

        test("should return empty array for non-existent department", async (): Promise<void> => {
            const response: Response = await request(app)
                .get("/api/v1/employees/department/NonExistentDept");
            
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
        });
    });

    describe("createEmployee", (): void => {
        test("should return 201 status and success message for valid data", async (): Promise<void> => {
            const newEmployee: Omit<Employee, "id"> = {
                name: "Test Employee",
                position: "Test Position",
                department: "Testing",
                email: "test@pixell-river.com",
                phone: "123-4567",
                branchId: 1
            };

            const response: Response = await request(app)
                .post("/api/v1/employees")
                .send(newEmployee);
            
            expect(response.status).toBe(201);
                expect(response.body.status).toBe("success");
                expect(response.body.message).toBe("Employee created successfully");
        });

        // this is so ugly but i couldn't come up with anything better
        test("should return 400 status for missing required fields", async (): Promise<void> => {
            const invalidEmployee1: Partial<Omit<Employee, "id">> = {
                name: "Test Employee"
            };

            const response1: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee1);
            
            expect(response1.status).toBe(400);
            expect(response1.body.error).toContain("Position is required");

            const invalidEmployee2: Partial<Omit<Employee, "id">> = {
                name: "Test Employee",
                position: "Test Position"
            };

            const response2: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee2);
            
            expect(response2.status).toBe(400);
            expect(response2.body.error).toContain("Department is required");

            const invalidEmployee3: Partial<Omit<Employee, "id">> = {
                name: "Test Employee",
                position: "Test Position",
                department: "Testing"
            };

            const response3: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee3);
            
            expect(response3.status).toBe(400);
            expect(response3.body.error).toContain("Email is required");

            const invalidEmployee4: Partial<Omit<Employee, "id">> = {
                name: "Test Employee",
                position: "Test Position",
                department: "Testing",
                email: "test@example.com"
            };

            const response4: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee4);
            
            expect(response4.status).toBe(400);
            expect(response4.body.error).toContain("Phone is required");

            const invalidEmployee5: Partial<Omit<Employee, "id">> = {
                name: "Test Employee",
                position: "Test Position",
                department: "Testing",
                email: "test@example.com",
                phone: "123-4567"
            };

            const response5: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee5);
            
            expect(response5.status).toBe(400);
            expect(response5.body.error).toContain("branchId is required");

            const invalidEmployee6: Partial<Omit<Employee, "id">> = {
                position: "Test Position",
                department: "Testing",
                email: "test@example.com",
                phone: "123-4567",
                branchId: 1
            };

            const response6: Response = await request(app)
                .post("/api/v1/employees")
                .send(invalidEmployee6);
            
            expect(response6.status).toBe(400);
            expect(response6.body.error).toContain("Name is required");
        });
    });

    describe("updateEmployee", (): void => {
        let createdEmployeeId: number;

        beforeEach(async (): Promise<void> => {
            const newEmployee: Omit<Employee, "id"> = {
                name: "Update Test Employee",
                position: "Test Position",
                department: "Testing",
                email: "update@test.com",
                phone: "123-4567",
                branchId: 1
            };

            const createResponse: Response = await request(app)
                .post("/api/v1/employees")
                .send(newEmployee);
            
            createdEmployeeId = createResponse.body.data.id;
        });

        test("should return 200 status and success message for valid update", async (): Promise<void> => {
            const updateData: Partial<Omit<Employee, "id">> = {
                name: "Updated Employee Name",
                phone: "123-4567"
            };

            const response: Response = await request(app)
                .put(`/api/v1/employees/${createdEmployeeId}`)
                .send(updateData);
            
            expect(response.status).toBe(200);
                expect(response.body.status).toBe("success");
                expect(response.body.message).toBe("Employee updated successfully");
        });

        test("should return 404 status for non-existent employee ID", async (): Promise<void> => {
            const updateData: Partial<Omit<Employee, "id">> = {
                name: "Updated Employee Name"
            };

            const response: Response = await request(app)
                .put("/api/v1/employees/9999")
                .send(updateData);
            
            expect(response.status).toBe(404);
            expect(response.body.status).toBe("error");
            expect(response.body.message).toContain("Employee with ID 9999 not found");
        });
    });

    describe("deleteEmployee", (): void => {
        let createdEmployeeId: number;

        beforeEach(async (): Promise<void> => {
            const newEmployee: Omit<Employee, "id"> = {
                name: "Delete Test Employee",
                position: "Test Position",
                department: "Testing",
                email: "delete@test.com",
                phone: "123-4567",
                branchId: 1
            };

            const createResponse: Response = await request(app)
                .post("/api/v1/employees")
                .send(newEmployee);
            
            createdEmployeeId = createResponse.body.data.id;
        });

        test("should return 200 status and success message for valid deletion", async (): Promise<void> => {
            const response: Response = await request(app)
                .delete(`/api/v1/employees/${createdEmployeeId}`);
            
            expect(response.status).toBe(200);
                expect(response.body.status).toBe("success");
                expect(response.body.message).toBe("Employee deleted successfully");

            const getResponse: Response = await request(app)
                .get(`/api/v1/employees/${createdEmployeeId}`);
            expect(getResponse.status).toBe(404);
        });

        test("should return 404 status for non-existent employee ID", async (): Promise<void> => {
            const response: Response = await request(app)
                .delete("/api/v1/employees/9999");
            
            expect(response.status).toBe(404);
            expect(response.body.status).toBe("error");
            expect(response.body.message).toContain("Employee with ID 9999 not found");
        });
    });
});