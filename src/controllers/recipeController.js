const { response, responseError } = require("../helpers/response.js");
const recipeModel = require("../models/recipeModel.js");

const recipeController = {
	getAllRecipes: (req, res) => {
		let search = req.query.search || "";
		let sort = req.query.sort || "ASC";
		let limit = req.query.limit || 10;
		let offset = req.query.offset || 0;

		recipeModel
			.selectAllRecipes(search, sort, limit, offset)
			.then((result) => {
				return response(res, result.rows, 200, "get recipes success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	createRecipe: async (req, res) => {
		try {
			const {
				title,
				description,
				image,
				category_id,
				ingredients,
				video,
				user_id,
			} = req.body;

			const data = {
				title,
				description,
				image,
				category_id,
				ingredients,
				video,
				user_id,
			};

			await recipeModel.insertRecipe(data);

			return response(res, data, 201, "create recipe success");
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	getRecipe: async (req, res) => {
		const recipe_id = req.params.id;

		recipeModel
			.selectRecipe(recipe_id)
			.then((result) => {
				let { rowCount } = result;
				if (!rowCount) {
					return responseError(res, 404, "Recipe id is not found");
				}

				return response(res, result.rows, 200, "get recipe success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	updateRecipe: async (req, res) => {
		try {
			const recipe_id = req.params.id;
			const {
				title,
				description,
				image,
				category_id,
				ingredients,
				video,
				user_id,
			} = req.body;

			const { rowCount } = await recipeModel.selectRecipe(recipe_id);
			if (!rowCount) {
				return responseError(res, 404, "Recipe id is not found");
			}

			const data = {
				recipe_id,
				title,
				description,
				image,
				category_id,
				video,
				ingredients,
				user_id,
			};

			await recipeModel.updateRecipe(data);

			return response(res, data, 200, "update recipe success");
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	deleteRecipe: async (req, res) => {
		try {
			const recipe_id = req.params.id;

			const { rowCount } = await recipeModel.selectRecipe(recipe_id);
			if (!rowCount) {
				return responseError(res, 404, "Recipe id is not found");
			}

			recipeModel
				.deleteRecipe(recipe_id)
				.then(() => {
					return response(res, null, 200, "delete recipe success");
				})
				.catch((error) => {
					return responseError(res, 500, error.message);
				});
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},
};

module.exports = recipeController;
