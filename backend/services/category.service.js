const categoryRepository = require('../repositories/category.repository');

class CategoryService {
    async getAllCategories() {
        return await categoryRepository.findAll();
    }

    async getCategoryById(id) {
        const category = await categoryRepository.findById(id);
        if (!category) {
            const error = new Error('Category not found');
            error.status = 404;
            throw error;
        }
        return category;
    }

    async createCategory(categoryData) {
        if (!categoryData.name || categoryData.name.length > 128) {
            const error = new Error('Invalid category name');
            error.status = 400;
            throw error;
        }
        return await categoryRepository.create(categoryData);
    }

    async updateCategory(id, categoryData) {
        if (!categoryData.name || categoryData.name.length > 128) {
            const error = new Error('Invalid category name');
            error.status = 400;
            throw error;
        }

        const category = await categoryRepository.update(id, categoryData);
        if (!category) {
            const error = new Error('Category not found');
            error.status = 404;
            throw error;
        }
        return category;
    }

    async deleteCategory(id) {
        const deleted = await categoryRepository.delete(id);
        if (!deleted) {
            const error = new Error('Category not found');
            error.status = 404;
            throw error;
        }
        return true;
    }
}

module.exports = new CategoryService();