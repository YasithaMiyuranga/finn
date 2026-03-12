import api from './api';

// Violation Type Service
const violationTypeService = {
    // Get all violation types
    async getAllViolationTypes() {
        const response = await api.get('/violation_type/getViolationType');
        return response.data;
    },

    // Get violation type by ID
    async getViolationTypeById(typeId) {
        const response = await api.get('/violation_type/getViolationType');
        const allTypes = response.data.data || [];
        return allTypes.find(v => v.typeId === typeId);
    }
};

export default violationTypeService;
