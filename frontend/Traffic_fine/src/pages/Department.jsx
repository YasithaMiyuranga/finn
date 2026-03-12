

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Placeholder Components - You must create these files
// Ensure these files exist with at least a basic structure as explained before!



import Header from '../context/Header'; 
import TopNav from '../context/TopNav'; 
import Footer from '../context/Footer'; 
import LeftSidebar from '../context/LeftSidebar';

// --- Mock Data and Functions (No Change) ---
const fetchDriverCounts = async () => {
  return {
    registeredDrivers: 15,
    last7DaysRegistered: 5,
    lastMonthRegistered: 0,
    lastYearRegistered: 0,
  };
};

const fetchMonthlyRegistrationData = async () => {
  const currentYear = new Date().getFullYear();
  return {
    year: currentYear,
    monthlyCounts: [
      30, 45, 60, 50, 75, 80,
      40, 55, 65, 70, 85, 90
    ]
  };
};

const initializeChart = (monthlyData) => {
  const ctx = document.getElementById("issuedFineCount");
  if (ctx && window.Chart) {
    new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        datasets: [{
          label: "Registered Drivers Count",
          // Tailwind-friendly color is replaced with a hex value for Chart.js
          backgroundColor: "#d9534f", 
          data: monthlyData,
        }]
      },
      options: {
        legend: { display: false },
        responsive: true,
        title: { display: false },
        animation: { duration: 2000 },
        maintainAspectRatio: false,
        bezierCurve: false,
      }
    });
  }
};
// --- End Mock Data and Functions ---

const Department = () => {
  const [counts, setCounts] = useState({
    registeredDrivers: 0,
    last7DaysRegistered: 0,
    lastMonthRegistered: 0,
    lastYearRegistered: 0,
  });
  
  const [monthlyCounts, setMonthlyCounts] = useState([]);
  const [isLoggedIn] = useState(true);
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const fetchDashboardData = useCallback(async () => {
    try {
      const countData = await fetchDriverCounts();
      setCounts(countData);
      const chartData = await fetchMonthlyRegistrationData();
      setMonthlyCounts(chartData.monthlyCounts);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log("Redirecting to login..."); 
      // navigate('/index.php'); // Uncomment this for actual routing
    } else {
        fetchDashboardData();
    }
  }, [isLoggedIn, fetchDashboardData]);

  useEffect(() => {
    if (monthlyCounts.length > 0) {
      initializeChart(monthlyCounts);
    }
  }, [monthlyCounts]);


  if (!isLoggedIn) {
    return null; 
  }

  // Helper component for the Count Boxes (re-using Tailwind styles)
  const DashboardCounter = ({ title, count, icon, bgColorClass }) => (
    <div className="w-full lg:w-1/4 p-2">
      {/* Replaced dashcounter with Tailwind classes: bg-color, rounded-lg, shadow-xl, p-6, hover effect */}
      <div 
        title={title} // Used as a replacement for data-title and data-toggle/data-placement
        className={`dashcounter ${bgColorClass} rounded-lg shadow-xl p-6 transition duration-300 ease-in-out transform hover:scale-[1.02] cursor-pointer`}
      >
        <p className="text-white text-3xl mb-2">
          <i className={`fas ${icon}`}></i>
        </p>
        <h3 className="text-white text-4xl font-bold counter">{count}</h3>
        <p className="text-white text-sm opacity-90">{title}</p>
      </div>
    </div>
  );

  return (
    // Replaced 'overlay-scrollbar' class with Tailwind
    <div className="min-h-screen bg-gray-100 flex"> 
      {/* Components */}
      <Header /> 
      <TopNav /> 
      <LeftSidebar /> 

      {/* SECTION_03: Dashboard main content start here */}
      {/* Replaced dashwrapper/animated fadeIn with Tailwind's flex-1, p-4/6 */}
      <div className="flex-1 p-4 lg:p-6 ml-64 transition-all duration-300"> 
        <div className="container-fluid mx-auto">
          {/* Account Holder Tag */}
          <div className="mt-4 mb-6">
            <span className="inline-block px-4 py-2 text-xs font-semibold text-gray-800 bg-white rounded-full shadow-md">
              Account Holder : <span className="font-bold">Motor Traffic Department</span>
            </span>
          </div>
          
          {/* Main four count boxes start here */}
          {/* Replaced 'row p-2' with Tailwind Grid/Flex structure */}
          <div className="flex flex-wrap -m-2"> 
            
            <DashboardCounter
              title="Registered Drivers"
              count={counts.registeredDrivers}
              icon="fa-users"
              bgColorClass="bg-red-500" // Custom Tailwind color for 'color-one'
            />
            
            <DashboardCounter
              title="Last 7 Days Registered"
              count={counts.last7DaysRegistered}
              icon="fa-list-alt"
              bgColorClass="bg-blue-500" // Custom Tailwind color for 'color-two'
            />
            
            <DashboardCounter
              title="Last Month Registered"
              count={counts.lastMonthRegistered}
              icon="fa-calendar-alt"
              bgColorClass="bg-yellow-500" // Custom Tailwind color for 'color-four'
            />
            
            <DashboardCounter
              title="Last Year Registered"
              count={counts.lastYearRegistered}
              icon="fa-calendar-check"
              bgColorClass="bg-green-500" // Custom Tailwind color for 'color-three'
            />
          </div>
          {/* Main four count boxes end here */}

          {/* Charts start here */}
          <div className="mt-8">
            <div className="w-full">
              {/* Replaced mycard with Tailwind classes: bg-white, rounded-lg, shadow-lg */}
              <div className="bg-white rounded-lg shadow-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Registered Drivers Count {currentYear}
                  </h3>
                </div>
                <div className="p-4">
                  {/* Canvas element for Chart.js */}
                  <div className="relative" style={{ height: '300px' }}>
                    <canvas id="issuedFineCount"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Charts end here */}
        </div>
      </div>
      {/* Dashboard main content end here */}

      <Footer /> 
    </div>
  );
};

export default  Department;