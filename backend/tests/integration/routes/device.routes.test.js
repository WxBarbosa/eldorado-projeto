const request = require('supertest');
const app = require('../../../app');
const deviceService = require('../../../services/device.service');

jest.mock('../../../services/device.service');

describe('Device Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /api/devices should return all devices', async () => {
        const mockDevices = [{ id: 1, color: 'Red', part_number: 123 }, { id: 2, color: 'Blue', part_number: 456 }];
        deviceService.getAllDevices.mockResolvedValue(mockDevices);

        const response = await request(app).get('/api/devices').expect(200);

        expect(response.body).toEqual(mockDevices);
        expect(deviceService.getAllDevices).toHaveBeenCalledTimes(1);
    });

    it('POST /api/devices should create a new device with valid data', async () => {
        const mockDevice = { id: 1, color: 'Green', part_number: 789, category_id: 1 };
        deviceService.createDevice.mockResolvedValue(mockDevice);

        const response = await request(app)
            .post('/api/devices')
            .send({ color: 'Green', part_number: 789, category_id: 1 })
            .expect(201);

        expect(response.body).toEqual(mockDevice);
        expect(deviceService.createDevice).toHaveBeenCalledWith({ color: 'Green', part_number: 789, category_id: 1 });
    });

    it('POST /api/devices should return 400 for invalid data', async () => {
        const response = await request(app)
            .post('/api/devices')
            .send({ color: '', part_number: 0, category_id: null }) // Invalid data
            .expect(400);

        expect(response.body.errors).toBeDefined();
    });

    it('GET /api/devices/:id should return a device by ID', async () => {
        const mockDevice = { id: 1, color: 'Red', part_number: 123, category_id: 1 };
        deviceService.getDeviceById.mockResolvedValue(mockDevice);

        const response = await request(app).get('/api/devices/1').expect(200);

        expect(response.body).toEqual(mockDevice);
        expect(deviceService.getDeviceById).toHaveBeenCalledWith(1);
    });

    it('GET /api/devices/:id should return 404 for non-existent device', async () => {
        deviceService.getDeviceById.mockResolvedValue(null);

        await request(app).get('/api/devices/999').expect(404);
    });
});