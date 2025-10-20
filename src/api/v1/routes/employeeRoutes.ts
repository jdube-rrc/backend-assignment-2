import express, { Router } from "express";
import * as employeeController from "../controllers/employeeController";
import { validateRequest } from "../../../middleware/validate";
import { employeeSchemas } from "../validations/employeeValidation";

const router: Router = express.Router();

router.get("/", employeeController.getAllEmployees);
router.get("/:id", validateRequest(employeeSchemas.getById), employeeController.getEmployeeById);
router.get("/branch/:id", validateRequest(employeeSchemas.getByBranch), employeeController.getEmployeesByBranch);
router.get("/department/:department", validateRequest(employeeSchemas.getByDepartment), employeeController.getEmployeeByDepartment);
router.post("/", validateRequest(employeeSchemas.create), employeeController.createEmployee);
router.put("/:id", validateRequest(employeeSchemas.update), employeeController.updateEmployee);
router.delete("/:id", validateRequest(employeeSchemas.delete), employeeController.deleteEmployee);

export default router;