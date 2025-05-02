const deviceRepository = require('../repositories/device.repository');
const categoryService = require('./category.service');

class DeviceService {
    async getAllDevices() {
        return await deviceRepository.findAll();
    }

    async getDeviceById(id) {
        const device = await deviceRepository.findById(id);
        if (!device) {
            const error = new Error('Device not found');
            error.status = 404;
            throw error;
        }
        return device;
    }

    async createDevice(deviceData) {
        await this.validateDeviceData(deviceData);
        
        // Verify if category exists
        await categoryService.getCategoryById(deviceData.category_id);
        
        return await deviceRepository.create(deviceData);
    }

    async updateDevice(id, deviceData) {
        await this.validateDeviceData(deviceData);
        
        // Verify if category exists
        await categoryService.getCategoryById(deviceData.category_id);

        const device = await deviceRepository.update(id, deviceData);
        if (!device) {
            const error = new Error('Device not found');
            error.status = 404;
            throw error;
        }
        return device;
    }

    async deleteDevice(id) {
        const deleted = await deviceRepository.delete(id);
        if (!deleted) {
            const error = new Error('Device not found');
            error.status = 404;
            throw error;
        }
        return true;
    }

    async validateDeviceData(deviceData) {
        if (!deviceData.category_id) {
            const error = new Error('Category ID is required');
            error.status = 400;
            throw error;
        }

        if (!deviceData.color || !/^[a-zA-Z]+$/.test(deviceData.color) || deviceData.color.length > 16) {
            const error = new Error('Invalid color format');
            error.status = 400;
            throw error;
        }

        if (!deviceData.part_number || deviceData.part_number < 1) {
            const error = new Error('Invalid part number');
            error.status = 400;
            throw error;
        }
    }
}

module.exports = new DeviceService();