import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import new feature components
import AIChat from '../features/AIChat/AIChat';
import GrievanceForm from '../features/Grievance/GrievanceForm';
import ReportsDashboard from '../features/Reports/ReportsDashboard';
import FinePaymentPage from '../features/Payment/FinePaymentPage';

// Import role-based dashboards
import DriverDashboard from '../features/Driver/DriverDashboard';
import CompleteProfile from '../features/Driver/CompleteProfile';
import PendingFine from '../features/Driver/pages/PendingFine';
import PaidFine from '../features/Driver/pages/PaidFine';
import DriverViolationDetails from '../features/Driver/pages/ViolationDetails'; // Renamed to avoid collision with Admin's ViolationDetails
import PayFine from '../features/Driver/pages/PayFine';
import GeneralUserDashboard from '../features/User/GeneralUserDashboard';
// import PoliceOICDashboard from '../features/PoliceOIC/PoliceOICDashboard';
import AdminDashboard from '../features/Admin/AdminDashboard';
import ViewAllDrivers from '../features/Admin/ViewAllDrivers';
import AddTrafficOfficer from '../features/Admin/AddTrafficOfficer';
import AddOic from '../features/Admin/AddOic';
import ViewAllTrafficOfficers from '../features/Admin/ViewAllTrafficOfficers';
import ViolationDetails from '../features/Admin/ViolationDetails'; // Existing Admin ViolationDetails
import PaidFineTickets from '../features/Admin/PaidFineTickets';
import PendingFineTickets from '../features/Admin/PendingFineTickets';
import ViewAllPoliceOic from '../features/Admin/ViewAllPoliceOic';
import AdminOfficerDashboard from '../features/Admin/PoliceOfficerDashboard'; 
import PoliceOfficerDashboard from '../features/PoliceOfficer/PoliceOfficerDashboard';
import AddNewFine from '../features/PoliceOfficer/AddNewFine';
import ViewReportedFine from '../features/PoliceOfficer/ViewReportedFine';

// Import Police OIC components
import PoliceOICDashboard from '../features/PoliceOIC/PoliceOICDashboard';
import AddTrafficOfficerOIC from '../features/PoliceOIC/AddTrafficOfficer';
import ViewAllTrafficOfficersOIC from '../features/PoliceOIC/ViewAllTrafficOfficers';
import ViewAllDriversOIC from '../features/PoliceOIC/ViewAllDrivers';
import RepeatOffenders from '../features/PoliceOIC/RepeatOffenders';

const DashboardRouter = () => {
    return (
        <Routes>
            {/* Role-based Dashboard Routes */}
            <Route path="/driver" element={<DriverDashboard />} />
            <Route path="/driver/complete-profile" element={<CompleteProfile />} />
            <Route path="/driver/pending-fine" element={<PendingFine />} />
            <Route path="/driver/pay-fine/:refNo" element={<PayFine />} />
            <Route path="/driver/paid-fine" element={<PaidFine />} />
            <Route path="/driver/violation-details" element={<DriverViolationDetails />} />
            <Route path="/user" element={<GeneralUserDashboard />} />
            {/* <Route path="/oic" element={<PoliceOICDashboard />} /> */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/officer-dashboard" element={<AdminOfficerDashboard />} />
            <Route path="/admin/add-traffic-officer" element={<AddTrafficOfficer />} />
            <Route path="/admin/add-oic" element={<AddOic />} />
            <Route path="/admin/view-all-traffic-officers" element={<ViewAllTrafficOfficers />} />
            <Route path="/admin/view-all-drivers" element={<ViewAllDrivers />} />
            <Route path="/admin/violation-details" element={<ViolationDetails />} />
            <Route path="/admin/paid-fine-tickets" element={<PaidFineTickets />} />
            <Route path="/admin/pending-fine-tickets" element={<PendingFineTickets />} />
            <Route path="/admin/view-all-police-oic" element={<ViewAllPoliceOic />} />

            {/* Police OIC Routes */}
            <Route path="/police-oic" element={<PoliceOICDashboard />} />
            <Route path="/police-oic/add-traffic-officer" element={<AddTrafficOfficerOIC />} />
            <Route path="/police-oic/view-all-traffic-officers" element={<ViewAllTrafficOfficersOIC />} />
            <Route path="/police-oic/view-all-drivers" element={<ViewAllDriversOIC />} />
            <Route path="/police-oic/repeat-offenders" element={<RepeatOffenders />} />

            <Route path="/policeofficer" element={<PoliceOfficerDashboard />} />
            <Route path="/policeofficer/add-new-fine" element={<AddNewFine />} />
            <Route path="/policeofficer/view-reported-fine" element={<ViewReportedFine />} />

            {/* Feature Routes */}
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/grievance" element={<GrievanceForm />} />
            <Route path="/reports" element={<ReportsDashboard />} />
            <Route path="/my-fines" element={<FinePaymentPage />} />
        </Routes>
    );
};

export default DashboardRouter;
