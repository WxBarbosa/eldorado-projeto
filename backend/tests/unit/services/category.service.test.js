const CategoryService = require('../../../services/category.service');
const categoryRepository = require('../../../repositories/category.repository');

jest.mock('../../../repositories/category.repository');

describe('CategoryService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return all categories', async () => {
        const mockCategories = [{ id: 1, name: 'Category 1' }, { id: 2, name: 'Category 2' }];
        categoryRepository.findAll.mockResolvedValue(mockCategories);

        const categories = await CategoryService.getAllCategories();

        expect(categories).toEqual(mockCategories);
        expect(categoryRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should create a new category', async () => {
        const mockCategory = { id: 1, name: 'New Category' };
        categoryRepository.create.mockResolvedValue(mockCategory);

        const category = await CategoryService.createCategory({ name: 'New Category' });

        expect(category).toEqual(mockCategory);
        expect(categoryRepository.create).toHaveBeenCalledWith({ name: 'New Category' });
    });
});