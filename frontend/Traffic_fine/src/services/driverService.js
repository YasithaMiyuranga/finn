import api from './api';

// Driver Service
const driverService = {
    // Get all drivers
    async getAllDrivers() {
        const response = await api.get('/driver/getDriver');
        return response.data;
    },

    // Search driver by license
    async searchByLicense(licenseNumber) {
        const response = await api.get('/driver/getDriver');
        const allDrivers = response.data.data || [];
        return allDrivers.find(d => d.licenseNumber === licenseNumber);
    },

    // Get driver by ID
    async getDriverById(driverId) {
        const response = await api.get('/driver/getDriver');
        const allDrivers = response.data.data || [];
        return allDrivers.find(d => d.driverId === driverId);
    },

    // Search driver by NIC
    async searchByNIC(nic) {
        const response = await api.get('/driver/getDriver');
        const allDrivers = response.data.data || [];
        return allDrivers.find(d => d.nic === nic);
    }
};

export default driverService;
