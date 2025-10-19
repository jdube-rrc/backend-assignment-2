import { Employee } from "../src/data/employees";
import * as employeeService from "../src/api/v1/services/employeeService";

describe("employeeService Firestore integration", (): void => {
  test("getAllEmployees returns seeded employees", async (): Promise<void> => {
    const result: Employee[] = await employeeService.getAllEmployees();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    // contains id 1 Alice Johnson from seed
    expect(result.some(e => e.id === 1 && typeof e.name === "string")).toBe(true);
  });

  test("getEmployeeById returns existing employee", async (): Promise<void> => {
    const employee: Employee = await employeeService.getEmployeeById(1);
    expect(employee.id).toBe(1);
    expect(employee).toHaveProperty("name");
  });

  test("getEmployeesByBranch filters by branchId", async (): Promise<void> => {
    const list: Employee[] = await employeeService.getEmployeesByBranch(1);
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    expect(list.every(e => e.branchId === 1)).toBe(true);
  });

  test("getEmployeeByDepartment filters by department", async (): Promise<void> => {
    const list: Employee[] = await employeeService.getEmployeeByDepartment("Management");
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    expect(list.every(e => e.department === "Management")).toBe(true);
  });

  test("createEmployee creates and returns new employee", async (): Promise<void> => {
    const created: Employee = await employeeService.createEmployee({
      name: "Service Tester",
      position: "QA",
      department: "IT",
      email: "service.tester@example.com",
      phone: "555-3333",
      branchId: 1,
    });
    expect(created.id).toBeGreaterThan(0);
    expect(created.name).toBe("Service Tester");

    const fetched: Employee = await employeeService.getEmployeeById(created.id);
    expect(fetched.email).toBe("service.tester@example.com");
  });

  test("updateEmployee updates existing employee fields", async (): Promise<void> => {
    const created: Employee = await employeeService.createEmployee({
      name: "To Update",
      position: "Junior",
      department: "IT",
      email: "to.update@example.com",
      phone: "555-4444",
      branchId: 1,
    });

    const updated: Employee = await employeeService.updateEmployee(created.id, { position: "Senior" });
    expect(updated.id).toBe(created.id);
    expect(updated.position).toBe("Senior");
  });

  test("deleteEmployee removes existing employee", async (): Promise<void> => {
    const created: Employee = await employeeService.createEmployee({
      name: "To Delete",
      position: "Temp",
      department: "IT",
      email: "to.delete@example.com",
      phone: "555-5555",
      branchId: 1,
    });

    await expect(employeeService.deleteEmployee(created.id)).resolves.toBeUndefined();
    await expect(employeeService.getEmployeeById(created.id)).rejects.toThrow("not found");
  });
});
