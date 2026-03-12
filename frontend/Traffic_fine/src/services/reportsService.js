import api from './api';

// Reports Service
const reportsService = {
    // Get province statistics
    async getProvinceStats() {
        const response = await api.get('/reports/province-stats');
        return response.data;
    },

    // Get time-based analytics
    async getTimeBased(startDate, endDate) {
        const response = await api.get('/reports/time-based', {
            params: { startDate, endDate }
        });
        return response.data;
    },

    // Get registration statistics
    async getRegistrationStats() {
        const response = await api.get('/reports/registration-stats');
        return response.data;
    },

    // Get collection summary
    async getCollectionSummary() {
        const response = await api.get('/reports/collection-summary');
        return response.data;
    },

    // Get repeat offenders
    async getRepeatOffenders() {
        const response = await api.get('/reports/repeat-offenders');
        return response.data;
    },

    // Get driver history
    async getDriverHistory(driverId) {
        const response = await api.get(`/reports/driver-history/${driverId}`);
        return response.data;
    },

    // Export report
    async exportReport(type) {
        const response = await api.get(`/reports/export/${type}`, {
            responseType: 'blob'
        });
        return response.data;
    }
};

export default reportsService;
