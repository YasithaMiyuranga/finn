import api from './api';

// Payment Service
const paymentService = {
    // Get all fines
    async getAllFines() {
        const response = await api.get('/traffic_fine/getTrafficFine');
        return response.data;
    },

    // Get unpaid fines for a driver
    async getUnpaidFines(driverId) {
        const response = await api.get('/traffic_fine/getTrafficFine');
        // Filter unpaid fines for this driver
        const allFines = response.data.data || [];
        return allFines.filter(fine =>
            fine.driverId === driverId && fine.paymentStatus === 'UNPAID'
        );
    },

    // Get paid fines (payment history)
    async getPaymentHistory(driverId) {
        const response = await api.get('/traffic_fine/getTrafficFine');
        const allFines = response.data.data || [];
        return allFines.filter(fine =>
            fine.driverId === driverId && fine.paymentStatus === 'PAID'
        );
    },

    // Process payment (update fine status)
    async processFinePayment(fineId, paymentData) {
        const response = await api.put(`/traffic_fine/updateTrafficFine/${fineId}`, {
            ...paymentData,
            paymentStatus: 'PAID',
            paymentDate: new Date().toISOString()
        });
        return response.data;
    },

    // Get fine by ID
    async getFineById(fineId) {
        const response = await api.get('/traffic_fine/getTrafficFine');
        const allFines = response.data.data || [];
        return allFines.find(fine => fine.fineId === fineId);
    }
};

export default paymentService;
