import api from './api';

// AI Chat Service
const aiService = {
    // Ask AI a question
    async askQuestion(question) {
        const response = await api.post('/ai/ask', { question });
        return response.data;
    },

    // Validate violation
    async validateViolation(violationDetails) {
        const response = await api.post('/ai/validate', violationDetails);
        return response.data;
    },

    // Get fine information
    async getFineInfo(violationType) {
        const response = await api.post('/ai/fine-info', { violationType });
        return response.data;
    },

    // Get dispute guidance
    async getDisputeGuide(situation) {
        const response = await api.post('/ai/dispute-guide', { situation });
        return response.data;
    },

    // Health check
    async healthCheck() {
        const response = await api.get('/ai/health');
        return response.data;
    }
};

export default aiService;
