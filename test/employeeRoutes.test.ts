import request from "supertest";
import app from "../src/app";

describe("Employee Routes", () => {
    test("GET /api/v1/employees should call getAllEmployees controller", async () => {
        const response = await request(app)
            .get("/api/v1/employees");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status");
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test("GET /api/v1/employees/:id should call getEmployeeById controller", async () => {
        const response = await request(app)
            .get("/api/v1/employees/1");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status");
        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toHaveProperty("id");
    });

    test("GET /api/v1/employees/branch/:branchId should call getEmployeesByBranch controller", async () => {
        const response = await request(app)
            .get("/api/v1/employees/branch/1");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status");
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test("GET /api/v1/employees/department/:department should call getEmployeeByDepartment controller", async () => {
        const response = await request(app)
            .get("/api/v1/employees/department/Sales");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status");
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);
    });
    
    test("POST /api/v1/employees should call createEmployee controller", async () => {
        const newEmployee = {
            name: "Update Test Employee",
            position: "Test Position",
            department: "Testing",
            email: "update@test.com",
            phone: "555-0456",
            branchId: 1
        };

        const createResponse = await request(app)
            .post("/api/v1/employees")
            .send(newEmployee);

        const employeeId = createResponse.body.data.id;

        const updateData = {
            name: "Updated Employee Name"
        };

        const response = await request(app)
            .put(`/api/v1/employees/${employeeId}`)
            .send(updateData);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status");
        expect(response.body).toHaveProperty("data");
        expect(response.body.data.name).toBe("Updated Employee Name");
    });

    test("DELETE /api/v1/employees/:id should call deleteEmployee controller", async () => {
        const newEmployee = {
            name: "Delete Test Employee",
            position: "Test Position", 
            department: "Testing",
            email: "delete@test.com",
            phone: "555-0789",
            branchId: 1
        };

        const createResponse = await request(app)
            .post("/api/v1/employees")
            .send(newEmployee);

        const employeeId = createResponse.body.data.id;

        const response = await request(app)
            .delete(`/api/v1/employees/${employeeId}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status");
        expect(response.body.status).toContain("deleted successfully");
    });
});