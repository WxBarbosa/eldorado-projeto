const categoryService = require('../services/category.service');

class CategoryController {
    async getAllCategories(req, res, next) {
        try {
            const categories = await categoryService.getAllCategories();
            res.json(categories);
        } catch (error) {
            next(error);
        }
    }

    async getCategoryById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const category = await categoryService.getCategoryById(id);
            res.json(category);
        } catch (error) {
            next(error);
        }
    }

    async createCategory(req, res, next) {
        try {
            const category = await categoryService.createCategory(req.body);
            res.status(201).json(category);
        } catch (error) {
            next(error);
        }
    }

    async updateCategory(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const category = await categoryService.updateCategory(id, req.body);
            res.json(category);
        } catch (error) {
            next(error);
        }
    }

    async deleteCategory(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            await categoryService.deleteCategory(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CategoryController();