import { Branch } from "../src/data/branches";
import * as branchService from "../src/api/v1/services/branchService";

// These tests rely on the jest.setup.ts Firestore mock with seed data

describe("branchService Firestore integration", (): void => {
  test("getAllBranches returns seeded branches", async (): Promise<void> => {
    const result: Branch[] = await branchService.getAllBranches();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    // contains id 1 Vancouver Branch from seed
    expect(result.some(b => b.id === 1 && typeof b.name === "string")).toBe(true);
  });

  test("getBranchById returns existing branch", async (): Promise<void> => {
    const branch: Branch = await branchService.getBranchById(1);
    expect(branch.id).toBe(1);
    expect(branch).toHaveProperty("name");
  });

  test("createBranch creates and returns new branch", async (): Promise<void> => {
    const created: Branch = await branchService.createBranch({
      name: "Service Test Branch",
      address: "10 Test Ave",
      phone: "555-0000",
    });
    expect(created.id).toBeGreaterThan(0);
    expect(created.name).toBe("Service Test Branch");

    const fetched: Branch = await branchService.getBranchById(created.id);
    expect(fetched.name).toBe("Service Test Branch");
  });

  test("updateBranch updates existing branch fields", async (): Promise<void> => {
    // ensure target exists
    const created: Branch = await branchService.createBranch({
      name: "Update Me",
      address: "100 Update St",
      phone: "555-1111",
    });

    const updated: Branch = await branchService.updateBranch(created.id, { name: "Updated Name" });
    expect(updated.id).toBe(created.id);
    expect(updated.name).toBe("Updated Name");
  });

  test("deleteBranch removes existing branch", async (): Promise<void> => {
    const created: Branch = await branchService.createBranch({
      name: "Delete Me",
      address: "200 Delete St",
      phone: "555-2222",
    });

    await expect(branchService.deleteBranch(created.id)).resolves.toBeUndefined();
    await expect(branchService.getBranchById(created.id)).rejects.toThrow("not found");
  });
});
