import api from './api';

// Driver Points Service
const pointsService = {
    // Get driver's points
    async getDriverPoints(driverId) {
        const response = await api.get(`/points/driver/${driverId}`);
        return response.data;
    },

    // Add points to driver
    async addPoints(driverId, points) {
        const response = await api.post(`/points/add/${driverId}/${points}`);
        return response.data;
    },

    // Get drivers approaching suspension
    async getApproachingSuspension() {
        const response = await api.get('/points/approaching-suspension');
        return response.data;
    },

    // Reset driver points
    async resetPoints(driverId) {
        const response = await api.put(`/points/reset/${driverId}`);
        return response.data;
    }
};

export default pointsService;
