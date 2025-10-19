import Joi, { StringSchema, NumberSchema, ObjectSchema } from "joi";

const name: StringSchema = Joi.string().trim().min(2).max(100).messages({
	"string.base": "Name must be a string",
	"string.empty": "Name cannot be empty",
	"string.min": "Name must be at least 2 characters",
	"string.max": "Name must be at most 100 characters",
});

const position: StringSchema = Joi.string().trim().min(2).max(100).messages({
	"string.base": "Position must be a string",
	"string.empty": "Position cannot be empty",
	"string.min": "Position must be at least 2 characters",
	"string.max": "Position must be at most 100 characters",
});

const department: StringSchema = Joi.string().trim().min(2).max(100).messages({
	"string.base": "Department must be a string",
	"string.empty": "Department cannot be empty",
	"string.min": "Department must be at least 2 characters",
	"string.max": "Department must be at most 100 characters",
});

const email: StringSchema = Joi.string().trim().email({ tlds: { allow: false } }).messages({
	"string.base": "Email must be a string",
	"string.empty": "Email cannot be empty",
	"string.email": "Email must be a valid email",
});

const phone: StringSchema = Joi.string()
	.trim()
	.pattern(/^[0-9\-+\s()]{7,20}$/)
	.messages({
		"string.base": "Phone must be a string",
		"string.empty": "Phone cannot be empty",
		"string.pattern.base": "Phone must be a valid phone number",
	});

const branchId: NumberSchema = Joi.number().integer().positive().messages({
	"number.base": "branchId must be a number",
	"number.integer": "branchId must be an integer",
	"number.positive": "branchId must be a positive number",
});

interface EmployeeSchemas {
	list: Record<string, never>;
	getById: {
		params: ObjectSchema;
	};
	getByBranch: {
		params: ObjectSchema;
	};
	getByDepartment: {
		params: ObjectSchema;
	};
	create: {
		body: ObjectSchema;
	};
	update: {
		params: ObjectSchema;
		body: ObjectSchema;
	};
	delete: {
		params: ObjectSchema;
	};
}

export const employeeSchemas: EmployeeSchemas = {
	// GET /api/v1/employees
	list: {},

	// GET /api/v1/employees/:id
	getById: {
		params: Joi.object({
			id: Joi.string().required().messages({
				"any.required": "Employee ID is required",
				"string.empty": "Employee ID cannot be empty",
			}),
		}),
	},

	// GET /api/v1/employees/branch/:id
	getByBranch: {
		params: Joi.object({
			id: Joi.string().required().messages({
				"any.required": "Branch ID is required",
				"string.empty": "Branch ID cannot be empty",
			}),
		}),
	},

	// GET /api/v1/employees/department/:department
	getByDepartment: {
		params: Joi.object({
			department: Joi.string().required().messages({
				"any.required": "Department is required",
				"string.empty": "Department cannot be empty",
			}),
		}),
	},
	// POST /api/v1/employees
	create: {
		body: Joi.object({
			name: name.required().messages({ "any.required": "Name is required" }),
			position: position.required().messages({ "any.required": "Position is required" }),
			department: department.required().messages({ "any.required": "Department is required" }),
			email: email.required().messages({ "any.required": "Email is required" }),
			phone: phone.required().messages({ "any.required": "Phone is required" }),
			branchId: branchId.required().messages({ "any.required": "branchId is required" }),
		}),
	},

	// PUT /api/v1/employees/:id
	update: {
		params: Joi.object({
			id: Joi.string().required().messages({
				"any.required": "Employee ID is required",
				"string.empty": "Employee ID cannot be empty",
			}),
		}),
		body: Joi.object({
			name: name.optional(),
			position: position.optional(),
			department: department.optional(),
			email: email.optional(),
			phone: phone.optional(),
			branchId: branchId.optional(),
		}),
	},

		// DELETE /api/v1/employees/:id
		delete: {
			params: Joi.object({
				id: Joi.string().required().messages({
					"any.required": "Employee ID is required",
					"string.empty": "Employee ID cannot be empty",
				}),
			}),
		},
};

