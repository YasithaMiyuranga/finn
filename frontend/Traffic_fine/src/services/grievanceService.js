import api from './api';

// Grievance Service
const grievanceService = {
    // Submit new grievance
    async submitGrievance(grievanceData) {
        const response = await api.post('/grievance/submit', grievanceData);
        return response.data;
    },

    // Get my grievances
    async getMyGrievances(driverId) {
        const response = await api.get(`/grievance/my-reports/${driverId}`);
        return response.data;
    },

    // Get all grievances (Admin)
    async getAllGrievances() {
        const response = await api.get('/grievance/all');
        return response.data;
    },

    // Update grievance status (Admin)
    async updateStatus(grievanceId, status, resolution) {
        const response = await api.put(
            `/grievance/update-status/${grievanceId}`,
            null,
            { params: { status, resolution } }
        );
        return response.data;
    },

    // Get pending grievances
    async getPendingGrievances() {
        const response = await api.get('/grievance/pending');
        return response.data;
    }
};

export default grievanceService;
