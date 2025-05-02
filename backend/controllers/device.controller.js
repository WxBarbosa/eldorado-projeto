const deviceService = require('../services/device.service');

class DeviceController {
    async getAllDevices(req, res, next) {
        try {
            const devices = await deviceService.getAllDevices();
            res.json(devices);
        } catch (error) {
            next(error);
        }
    }

    async getDeviceById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const device = await deviceService.getDeviceById(id);
            res.json(device);
        } catch (error) {
            next(error);
        }
    }

    async createDevice(req, res, next) {
        try {
            const device = await deviceService.createDevice(req.body);
            res.status(201).json(device);
        } catch (error) {
            next(error);
        }
    }

    async updateDevice(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const device = await deviceService.updateDevice(id, req.body);
            res.json(device);
        } catch (error) {
            next(error);
        }
    }

    async deleteDevice(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            await deviceService.deleteDevice(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new DeviceController();