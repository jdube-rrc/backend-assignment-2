import express, { Express } from "express";
import * as employeeController from "../controllers/employeeController";

const router = express.Router();

router.get("/", employeeController.getAllEmployees);
router.get("/:id", employeeController.getEmployeeById);
router.get("/branch/:id", employeeController.getEmployeesByBranch);
router.get("/department/:department", employeeController.getEmployeeByDepartment);
router.post("/", employeeController.createEmployee);
router.put("/:id", employeeController.updateEmployee);
router.delete("/:id", employeeController.deleteEmployee);

export default router;