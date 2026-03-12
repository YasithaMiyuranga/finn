-- Smart Traffic Fine Management System
-- New Features Database Tables
-- Run this script to create 4 new tables

USE stfms;  -- Replace with your database name if different

-- ========================================
-- 1. Driver Points Table
-- ========================================
-- Tracks violation points for each driver
CREATE TABLE IF NOT EXISTS Driver_Points (
    points_id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT NOT NULL UNIQUE,
    total_points INT DEFAULT 0,
    last_updated DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    suspension_reason TEXT,
    FOREIGN KEY (driver_id) REFERENCES Drivers(driver_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ========================================
-- 2. Violation Points Configuration Table
-- ========================================
-- Configures how many points each violation type is worth
CREATE TABLE IF NOT EXISTS Violation_Points_Config (
    config_id INT AUTO_INCREMENT PRIMARY KEY,
    violation_id INT NOT NULL UNIQUE,
    points INT NOT NULL,
    severity_level VARCHAR(20),
    description TEXT,
    FOREIGN KEY (violation_id) REFERENCES ViolationType(violation_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ========================================
-- 3. Grievance Reports Table
-- ========================================
-- Anti-corruption complaint tracking system
CREATE TABLE IF NOT EXISTS Grievance_Reports (
    grievance_id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_driver_id INT NOT NULL,
    accused_officer_id INT,
    complaint_details TEXT,
    reported_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'PENDING',
    resolution TEXT,
    resolved_at DATETIME,
    FOREIGN KEY (reporter_driver_id) REFERENCES Drivers(driver_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (accused_officer_id) REFERENCES Police_Officers(officer_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- ========================================
-- 4. Email Notifications Table
-- ========================================
-- Tracks email notifications sent to drivers
CREATE TABLE IF NOT EXISTS Email_Notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT NOT NULL,
    fine_id INT,
    email_type VARCHAR(50),
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'PENDING',
    email_content TEXT,
    recipient_email VARCHAR(100),
    FOREIGN KEY (driver_id) REFERENCES Drivers(driver_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (fine_id) REFERENCES Traffic_Fine(fine_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- ========================================
-- Insert Sample Violation Points Configuration
-- ========================================
-- Configure points for existing violations
-- Adjust violation_id values based on your existing ViolationType records

INSERT INTO Violation_Points_Config (violation_id, points, severity_level, description) VALUES
(1, 3, 'MEDIUM', 'No Revenue License - Medium severity violation'),
(2, 5, 'HIGH', 'Speeding - High severity violation'),
(3, 4, 'HIGH', 'No Driving License - High severity violation'),
(4, 2, 'LOW', 'Excessive Smoke Emission - Low severity violation');

-- Note: Update the violation_id values based on your actual ViolationType table IDs

-- ========================================
-- Verify Tables Created
-- ========================================
SHOW TABLES LIKE '%Points%';
SHOW TABLES LIKE 'Grievance%';
SHOW TABLES LIKE 'Email%';

-- ========================================
-- Check table structures
-- ========================================
DESCRIBE Driver_Points;
DESCRIBE Violation_Points_Config;
DESCRIBE Grievance_Reports;
DESCRIBE Email_Notifications;

-- ========================================
-- Success Message
-- ========================================
SELECT 'All 4 tables created successfully! ✅' AS Status;
