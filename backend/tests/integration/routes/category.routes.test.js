const request = require('supertest');
const app = require('../../../app');
const categoryService = require('../../../services/category.service');

jest.mock('../../../services/category.service');

describe('Category Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /api/categories should return all categories', async () => {
        const mockCategories = [{ id: 1, name: 'Category 1' }, { id: 2, name: 'Category 2' }];
        categoryService.getAllCategories.mockResolvedValue(mockCategories);

        const response = await request(app).get('/api/categories').expect(200);

        expect(response.body).toEqual(mockCategories);
        expect(categoryService.getAllCategories).toHaveBeenCalledTimes(1);
    });

    it('POST /api/categories should create a new category with valid data', async () => {
        const mockCategory = { id: 1, name: 'New Category' };
        categoryService.createCategory.mockResolvedValue(mockCategory);

        const response = await request(app)
            .post('/api/categories')
            .send({ name: 'New Category' })
            .expect(201);

        expect(response.body).toEqual(mockCategory);
        expect(categoryService.createCategory).toHaveBeenCalledWith({ name: 'New Category' });
    });

    it('POST /api/categories should return 400 for invalid data', async () => {
        const response = await request(app)
            .post('/api/categories')
            .send({ name: '' }) // Invalid name
            .expect(400);

        expect(response.body.errors).toBeDefined();
    });

    it('GET /api/categories/:id should return a category by ID', async () => {
        const mockCategory = { id: 1, name: 'Category 1' };
        categoryService.getCategoryById.mockResolvedValue(mockCategory);

        const response = await request(app).get('/api/categories/1').expect(200);

        expect(response.body).toEqual(mockCategory);
        expect(categoryService.getCategoryById).toHaveBeenCalledWith(1);
    });

    it('GET /api/categories/:id should return 404 for non-existent category', async () => {
        categoryService.getCategoryById.mockResolvedValue(null);

        await request(app).get('/api/categories/999').expect(404);
    });
});