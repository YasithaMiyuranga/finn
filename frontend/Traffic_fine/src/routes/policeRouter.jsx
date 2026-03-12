import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Police components
import PoliceDashboard from '../features/Police/PoliceDashboard';
import IssueFineForm from '../features/Police/IssueFineForm';

const PoliceRouter = () => {
    return (
        <Routes>
            {/* Police Routes */}
            <Route path="/dashboard" element={<PoliceDashboard />} />
            <Route path="/issue-fine" element={<IssueFineForm />} />
            <Route path="/search-driver" element={<div className="p-8 text-white">Driver Search - Coming Soon!</div>} />
            <Route path="/manage-fines" element={<div className="p-8 text-white">Manage Fines - Coming Soon!</div>} />
        </Routes>
    );
};

export default PoliceRouter;
