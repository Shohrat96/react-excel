import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import dayjs from 'dayjs';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import CSS for datepicker
import styles from "./Checklist.module.css";

function ChecklistPage() {
    const [checklistData, setChecklistData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedEntry, setExpandedEntry] = useState(null); // Keeps track of the expanded entry
    const [timeSearchQuery, setTimeSearchQuery] = useState(null); // Time search query as a date
    const [emailSearchQuery, setEmailSearchQuery] = useState(""); // Email search query

    // Predefined checklist items
    const predefinedChecklist = {
        scheduleOperations: [
            "Amendment(s) to flight schedule (new flight, cancellation, time revise, swap)",
            "Cross communication between related units regarding schedule amendment",
            "Diversion of flight(s)",
            "Technical malfunction of aircraft(s)",
            "Aircraft operating with MEL hold item(s)",
            "Flight crew or cabin crew changes",
            "Delay(s) more than 2 hours",
            "Flight(s) require CTOT handling",
            "Expiry of Slot(s)",
            "Problems during Passenger and/or Cargo handling",
            "Daily OCC Report generation (for shift 'N' only)"
        ],
        flightDispatch: [
            "OFPs and Briefing Packages prepared and sent to stations/crew",
            "NOTAM restrictions affecting the operation",
            "Active or Risk of aerodrome closure due to Weather",
            "Active or Risk of aerodrome closure due to Curfew",
            "Potential Low Visibility Operation",
            "Flight(s) with Payload restriction",
            "Airport and/or Airspace closure due to safety reasons",
            "Risk of diversion for flight(s) in progress",
            "Report(s) and/or Request(s) by the Flight Crew for flight(s) in progress",
            "Loss of tracking data for flight(s) in progress",
            "Route Analysis request from Commercial department",
            "Equipment, Hardware, Software malfunction in the office",
            "Have the cargo details from Baku and outstations been received?",
            "Any notes for ATC acknowledgement"
        ]
    };

    // Fetch checklist data from API
    useEffect(() => {
        const fetchChecklistData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/checklist/all`);
                setChecklistData(response.data);
            } catch (error) {
                console.error("Error fetching checklist data:", error);
                setError("Failed to fetch checklist data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchChecklistData();
    }, []);

    const toggleEntry = (id) => {
        setExpandedEntry((prev) => (prev === id ? null : id)); // Toggle expanded entry
    };

    const renderChecklistDetails = (entry) => {
        // Convert `schedule_operations` and `flight_dispatch` objects into arrays
        const scheduleOperations = entry.schedule_operations
            ? Object.values(entry.schedule_operations)
            : [];
        const flightDispatch = entry.flight_dispatch
            ? Object.values(entry.flight_dispatch)
            : [];

        // Render remarks history
        const remarksHistory = entry.remarks_history || [];

        // Render checklist with values from the API
        const renderChecklistItems = (predefinedItems, apiItems) => (
            <table className={styles.checklistTable}>
                <tbody>
                    {predefinedItems.map((item, index) => (
                        <tr key={index}>
                            <td style={{ fontWeight: "bold", paddingRight: "10px" }}>{index + 1}.</td>
                            <td>{item}</td>
                            <td style={{ fontWeight: "bold" }}>
                                {apiItems[index] === "yes" ? "✔️ Yes" : apiItems[index] === "no" ? "❌ No" : "⚪ N/A"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );

        return (
            <div className={styles.checklistDetails}>
                <h4 className={styles.title}>Schedule and Operations</h4>
                {renderChecklistItems(predefinedChecklist.scheduleOperations, scheduleOperations)}

                <h4 className={styles.title}>Flight Dispatch</h4>
                {renderChecklistItems(predefinedChecklist.flightDispatch, flightDispatch)}

                <h4>Special Remark</h4>
                <table className={styles.checklistTable}>
                    <tbody>
                        {remarksHistory.map((remark, index) => (
                            <tr key={remark.id}>
                                <td>{index + 1}</td>
                                <td>{new Date(remark.timestamp).toLocaleString()}</td>
                                <td>{remark.text}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h5><strong>Shift/Novbe:</strong> {entry.shift}</h5>
                <h5><strong> Dispatcher-Handing Over:</strong> {entry.email}</h5>
                <h5><strong> Dispatcher-Taking Over:</strong> {entry.dispatchertakingover}</h5>

                {/* PDF Download Button */}
                <button onClick={() => downloadPDF(entry)} className={styles.customButton}>
                    Download as PDF
                </button>
            </div>
        );
    };


    const downloadPDF = (entry) => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Color palette
        const colors = {
            primary: [41, 128, 185],    // Blue
            secondary: [52, 73, 94],    // Dark Blue-Gray
            text: [0, 0, 0],            // Black
            background: [240, 240, 240] // Light Gray
        };

        // Page margins
        const margin = {
            top: 20,
            left: 10,
            right: 20
        };

        // Function to set text color
        const setTextColor = (type = 'text') => {
            doc.setTextColor(...colors[type]);
        };

        // Function to add section header
        const addSectionHeader = (text, yPosition) => {
            doc.setFont('helvetica', 'bold');
            setTextColor('primary');
            doc.setFontSize(14);
            doc.text(text, margin.left, yPosition);
            doc.setDrawColor(...colors.primary);
            doc.line(margin.left, yPosition + 2, margin.left + 50, yPosition + 2, 'S');
            return yPosition + 8;
        };

        // Function to add section items
        const addSectionItems = (items, statuses, startY) => {
            let yPos = startY;
            doc.setFont('helvetica', 'normal');
            setTextColor();
            doc.setFontSize(11);

            items.forEach((item, index) => {
                const status = statuses[index];
                const statusColor =
                    status === 'yes' ? [0, 128, 0] :     // Green
                        status === 'no' ? [255, 0, 0] :      // Red
                            [128, 128, 128];                     // Gray

                doc.setTextColor(...statusColor);
                const statusText =
                    status === 'yes' ? 'Yes' :
                        status === 'no' ? 'No' :
                            ' N/A';

                // Split item text if it's too long
                const itemLines = doc.splitTextToSize(`${index + 1}.${item}: ${statusText}`, 170);
                doc.text(itemLines, margin.left, yPos);
                yPos += itemLines.length * 6;

                if (yPos > 270) {
                    doc.addPage();
                    yPos = margin.top;
                }
            });

            return yPos;
        };

        // Start PDF Generation
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        setTextColor('primary');
        doc.text("Flight Dispatcher Shift Handover Report", margin.left, margin.top);

        // Basic Entry Details  
        doc.setFont('helvetica', 'bold'); // Use bold for headers  
        setTextColor();
        doc.setFontSize(12);



        // Reset to normal font  
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);

        // Content  
        let lineHeight = 7; // Improved line spacing  
        let yPos = margin.top + 10;

        doc.text(
            `Date: ${new Date(dayjs(entry.created_at).utc().format('YYYY-MM-DD HH:mm:ss')).toLocaleString()}`,
            margin.left,
            yPos
        );
        yPos += lineHeight;

        doc.text(`Shift: ${entry.shift}`, margin.left, yPos);

        yPos += lineHeight;

        doc.text(`Dispatcher (Handing Over): ${entry.email}`, margin.left, yPos);
        yPos += lineHeight;

        doc.text(`Dispatcher (Taking Over): ${entry.dispatchertakingover}`, margin.left, yPos);

        let currentYPosition = yPos + 15; // Next section starts after some spacing



        // Schedule Operations Section
        currentYPosition = addSectionHeader("Schedule Operations", currentYPosition);
        currentYPosition = addSectionItems(
            predefinedChecklist.scheduleOperations,
            entry.schedule_operations,
            currentYPosition
        );


        // Flight Dispatch Section
        currentYPosition += 10;
        currentYPosition = addSectionHeader("Flight Dispatch", currentYPosition);
        currentYPosition = addSectionItems(
            predefinedChecklist.flightDispatch,
            entry.flight_dispatch,
            currentYPosition
        );

        // Special Remarks Section
        if (entry.remarks_history && entry.remarks_history.length > 0) {
            currentYPosition += 7;
            currentYPosition = addSectionHeader("Special Remarks", currentYPosition);

            doc.setFont('helvetica', 'normal');
            setTextColor();
            doc.setFontSize(11);

            entry.remarks_history.forEach((remark) => {
                const remarkText = `${new Date(remark.timestamp).toLocaleString()}: ${remark.text}`;
                const remarkLines = doc.splitTextToSize(remarkText, 170);
                doc.text(remarkLines, margin.left, currentYPosition);
                currentYPosition += remarkLines.length * 5;

                if (currentYPosition > 270) {
                    doc.addPage();
                    currentYPosition = margin.top;
                }
            });
        }



        // Footer
        doc.setFont('helvetica', 'italic');
        setTextColor('secondary');
        doc.setFontSize(10);
        doc.text(
            `Generated on ${new Date().toLocaleString()}`,
            margin.left,
            doc.internal.pageSize.height - 10
        );

        // Save PDF
        doc.save(`checklist_${entry.id}.pdf`);
    };


    // Filter the checklist data based on search queries
    const filteredChecklistData = checklistData.filter((entry) => {
        const matchesTime =
            timeSearchQuery === null ||
            new Date(dayjs(entry.created_at).utc().format('YYYY-MM-DD HH:mm:ss')).setHours(0, 0, 0, 0) === timeSearchQuery.setHours(0, 0, 0, 0);
        const matchesEmail = entry.email.toLowerCase().includes(emailSearchQuery.toLowerCase());

        return matchesTime && matchesEmail;
    });

    if (loading) {
        return <p>Loading checklist...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!checklistData || checklistData.length === 0) {
        return <p>No checklist data available.</p>;
    }

    return (
        <div>
            <h3 className={styles.title}>FLIGHT DISPATCHER SHIFT HANDOVER FORM</h3>

            {/* Search Filters */}
            <div>
                <DatePicker
                    selected={timeSearchQuery}
                    onChange={(date) => setTimeSearchQuery(date)} // Set selected date to timeSearchQuery
                    dateFormat="yyyy/MM/dd"
                    placeholderText="Select a date"
                    className={styles.searchButton}
                />
                <input
                    type="text"
                    placeholder="Search by email"
                    value={emailSearchQuery}
                    onChange={(e) => setEmailSearchQuery(e.target.value)}
                    className={styles.searchButton}
                />
            </div>

            {/* Display Filtered Data */}
            {filteredChecklistData.length === 0 ? (
                <p>No checklist data found.</p>
            ) : (
                filteredChecklistData.map((entry) => (
                    <div key={entry.id}>
                        {/* Title for the entry */}
                        <h3
                            onClick={() => toggleEntry(entry.id)}
                            style={{ cursor: "pointer", color: "#34495e" }}
                        >
                            {expandedEntry === entry.id ? "▼ Shift Handover " : "► Shift Handover "} - {dayjs(entry.created_at).utc().format('YYYY-MM-DD HH:mm:ss')} - {entry.email}
                        </h3>

                        {/* Conditionally render details */}
                        {expandedEntry === entry.id && renderChecklistDetails(entry)}
                    </div>
                ))
            )}
        </div>
    );
}

export default ChecklistPage;
