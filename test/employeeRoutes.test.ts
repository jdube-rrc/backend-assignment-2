import request, { Response } from "supertest";
import app from "../src/app";
import { Employee } from "../src/data/employees";

describe("Employee Routes", (): void => {
    test("GET /api/v1/employees should call getAllEmployees controller", async (): Promise<void> => {
        const response: Response = await request(app)
            .get("/api/v1/employees");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status");
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test("GET /api/v1/employees/:id should call getEmployeeById controller", async (): Promise<void> => {
        const response: Response = await request(app)
            .get("/api/v1/employees/1");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status");
        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toHaveProperty("id");
    });

    test("GET /api/v1/employees/branch/:branchId should call getEmployeesByBranch controller", async (): Promise<void> => {
        const response: Response = await request(app)
            .get("/api/v1/employees/branch/1");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status");
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test("GET /api/v1/employees/department/:department should call getEmployeeByDepartment controller", async (): Promise<void> => {
        const response: Response = await request(app)
            .get("/api/v1/employees/department/Sales");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status");
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);
    });
    
    test("POST /api/v1/employees should call createEmployee controller", async (): Promise<void> => {
        const newEmployee: Omit<Employee, "id"> = {
            name: "Update Test Employee",
            position: "Test Position",
            department: "Testing",
            email: "update@test.com",
            phone: "555-0456",
            branchId: 1
        };

        const createResponse: Response = await request(app)
            .post("/api/v1/employees")
            .send(newEmployee);

        const employeeId: number = createResponse.body.data.id;

        const updateData: Partial<Omit<Employee, "id">> = {
            name: "Updated Employee Name"
        };

        const response: Response = await request(app)
            .put(`/api/v1/employees/${employeeId}`)
            .send(updateData);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status");
        expect(response.body).toHaveProperty("data");
        expect(response.body.data.name).toBe("Updated Employee Name");
    });

    test("DELETE /api/v1/employees/:id should call deleteEmployee controller", async (): Promise<void> => {
        const newEmployee: Omit<Employee, "id"> = {
            name: "Delete Test Employee",
            position: "Test Position", 
            department: "Testing",
            email: "delete@test.com",
            phone: "555-0789",
            branchId: 1
        };

        const createResponse: Response = await request(app)
            .post("/api/v1/employees")
            .send(newEmployee);

        const employeeId: number = createResponse.body.data.id;

        const response: Response = await request(app)
            .delete(`/api/v1/employees/${employeeId}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status");
        expect(response.body.status).toBe("success");
        expect(response.body.message).toContain("deleted successfully");
    });
});