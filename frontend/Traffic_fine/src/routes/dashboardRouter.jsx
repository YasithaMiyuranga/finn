import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import new feature components
import AIChat from '../features/AIChat/AIChat';
import PointsDashboard from '../features/DriverPoints/PointsDashboard';
import GrievanceForm from '../features/Grievance/GrievanceForm';
import ReportsDashboard from '../features/Reports/ReportsDashboard';
import FinePaymentPage from '../features/Payment/FinePaymentPage';

// Import role-based dashboards
import DriverDashboard from '../features/Driver/DriverDashboard';
import GeneralUserDashboard from '../features/User/GeneralUserDashboard';
import PoliceOICDashboard from '../features/PoliceOIC/PoliceOICDashboard';

const DashboardRouter = () => {
    return (
        <Routes>
            {/* Role-based Dashboard Routes */}
            <Route path="/driver" element={<DriverDashboard />} />
            <Route path="/user" element={<GeneralUserDashboard />} />
            <Route path="/oic" element={<PoliceOICDashboard />} />

            {/* Feature Routes */}
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/points" element={<PointsDashboard />} />
            <Route path="/grievance" element={<GrievanceForm />} />
            <Route path="/reports" element={<ReportsDashboard />} />
            <Route path="/my-fines" element={<FinePaymentPage />} />
        </Routes>
    );
};

export default DashboardRouter;
