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
import CompleteProfile from '../features/Driver/CompleteProfile';
import GeneralUserDashboard from '../features/User/GeneralUserDashboard';
import PoliceOICDashboard from '../features/PoliceOIC/PoliceOICDashboard';
import AdminDashboard from '../features/Admin/AdminDashboard';
import ViewAllDrivers from '../features/Admin/ViewAllDrivers';
import AddTrafficOfficer from '../features/Admin/AddTrafficOfficer';
import ViewAllTrafficOfficers from '../features/Admin/ViewAllTrafficOfficers';
import ViolationDetails from '../features/Admin/ViolationDetails';
import PaidFineTickets from '../features/Admin/PaidFineTickets';
import PendingFineTickets from '../features/Admin/PendingFineTickets';
import PoliceOfficerDashboard from '../features/PoliceOfficer/PoliceOfficerDashboard';
import AddNewFine from '../features/PoliceOfficer/AddNewFine';
import ViewReportedFine from '../features/PoliceOfficer/ViewReportedFine';

const DashboardRouter = () => {
    return (
        <Routes>
            {/* Role-based Dashboard Routes */}
            <Route path="/driver" element={<DriverDashboard />} />
            <Route path="/driver/complete-profile" element={<CompleteProfile />} />
            <Route path="/user" element={<GeneralUserDashboard />} />
            <Route path="/oic" element={<PoliceOICDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/add-traffic-officer" element={<AddTrafficOfficer />} />
            <Route path="/admin/view-all-traffic-officers" element={<ViewAllTrafficOfficers />} />
            <Route path="/admin/view-all-drivers" element={<ViewAllDrivers />} />
            <Route path="/admin/violation-details" element={<ViolationDetails />} />
            <Route path="/admin/paid-fine-tickets" element={<PaidFineTickets />} />
            <Route path="/admin/pending-fine-tickets" element={<PendingFineTickets />} />
            <Route path="/policeofficer" element={<PoliceOfficerDashboard />} />
            <Route path="/policeofficer/add-new-fine" element={<AddNewFine />} />
            <Route path="/policeofficer/view-reported-fine" element={<ViewReportedFine />} />

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
