const DeviceService = require('../../../services/device.service');
const deviceRepository = require('../../../repositories/device.repository');
const categoryRepository = require('../../../repositories/category.repository');
const categoryService = require('../../../services/category.service');

jest.mock('../../../repositories/device.repository');
jest.mock('../../../repositories/category.repository');
jest.mock('../../../services/category.service');

describe('DeviceService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return all devices', async () => {
        const mockDevices = [{ id: 1, color: 'Red', part_number: 123 }, { id: 2, color: 'Blue', part_number: 456 }];
        deviceRepository.findAll.mockResolvedValue(mockDevices);

        const devices = await DeviceService.getAllDevices();

        expect(devices).toEqual(mockDevices);
        expect(deviceRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should create a new device', async () => {
        const mockDevice = { id: 1, color: 'Green', part_number: 789, category_id: 1 };
        deviceRepository.create.mockResolvedValue(mockDevice);
        categoryService.getCategoryById.mockResolvedValue({ id: 1, name: 'Test Category' });

        const device = await DeviceService.createDevice({ color: 'Green', part_number: 789, category_id: 1 });

        expect(device).toEqual(mockDevice);
        expect(categoryService.getCategoryById).toHaveBeenCalledWith(1);
        expect(deviceRepository.create).toHaveBeenCalledWith({ color: 'Green', part_number: 789, category_id: 1 });
    });
});