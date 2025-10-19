import Joi, { StringSchema, ObjectSchema } from "joi";

const name: StringSchema = Joi.string().trim().min(2).max(100).messages({
	"string.base": "Name must be a string",
	"string.empty": "Name cannot be empty",
	"string.min": "Name must be at least 2 characters",
	"string.max": "Name must be at most 100 characters",
});

const address: StringSchema = Joi.string().trim().min(5).max(200).messages({
	"string.base": "Address must be a string",
	"string.empty": "Address cannot be empty",
	"string.min": "Address must be at least 5 characters",
	"string.max": "Address must be at most 200 characters",
});

const phone: StringSchema = Joi.string()
	.trim()
	.pattern(/^[0-9\-+\s()]{7,20}$/)
	.messages({
		"string.base": "Phone must be a string",
		"string.empty": "Phone cannot be empty",
		"string.pattern.base": "Phone must be a valid phone number",
	});

interface BranchSchemas {
	list: Record<string, never>;
	getById: {
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

export const branchSchemas: BranchSchemas = {
	// GET /api/v1/branches
	list: {},

	// GET /api/v1/branches/:id
	getById: {
		params: Joi.object({
			id: Joi.string().required().messages({
				"any.required": "Branch ID is required",
				"string.empty": "Branch ID cannot be empty",
			}),
		}),
	},
	// POST /api/v1/branches
	create: {
		body: Joi.object({
			name: name.required().messages({ "any.required": "Name is required" }),
			address: address.required().messages({ "any.required": "Address is required" }),
			phone: phone.required().messages({ "any.required": "Phone is required" }),
		}),
	},

	// PUT /api/v1/branches/:id
	update: {
		params: Joi.object({
			id: Joi.string().required().messages({
				"any.required": "Branch ID is required",
				"string.empty": "Branch ID cannot be empty",
			}),
		}),
		body: Joi.object({
			name: name.optional(),
			address: address.optional(),
			phone: phone.optional(),
		}),
	},

		// DELETE /api/v1/branches/:id
		delete: {
			params: Joi.object({
				id: Joi.string().required().messages({
					"any.required": "Branch ID is required",
					"string.empty": "Branch ID cannot be empty",
				}),
			}),
		},
};

