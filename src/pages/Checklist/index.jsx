import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
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
            "Equipment, Hardware, Software malfunction in the office"
        ]
    };

    // Fetch checklist data from API
    useEffect(() => {
        const fetchChecklistData = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:3001/api/checklist/all");
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
            <table>
                <tbody>
                    {predefinedItems.map((item, index) => (
                        <tr key={index}>
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
            <div className="checklist-details">
                <h4>Schedule Operations</h4>
                {renderChecklistItems(predefinedChecklist.scheduleOperations, scheduleOperations)}

                <h4>Flight Dispatch</h4>
                {renderChecklistItems(predefinedChecklist.flightDispatch, flightDispatch)}

                <h4>Special Remark</h4>
                <table>
                    <tbody>
                        {remarksHistory.map((remark) => (
                            <tr key={remark.id}>
                                <td>{new Date(remark.timestamp).toLocaleString()}</td>
                                <td>{remark.text}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <p><strong>Email:</strong> {entry.email}</p>
                {/* PDF Download Button */}
                <button onClick={() => downloadPDF(entry)} className={styles.customButton}>
                    Download as PDF
                </button>
            </div>
        );
    };


    const downloadPDF = (entry) => {
        const doc = new jsPDF();

        // Set tighter letter spacing
        doc.setCharSpace(-0.5); // Adjust the letter spacing to reduce gaps

        // Add Title
        doc.setFontSize(14); // Smaller font size for the title
        doc.setFont("helvetica", "bold");
        doc.text("Checklist Report", 20, 20);

        // Add Checklist Entry Data
        doc.setFontSize(10); // Smaller font size for entry data
        doc.setFont("helvetica", "normal");
        doc.text(`Date: ${new Date(entry.createdAt).toLocaleString()}`, 20, 30);
        doc.text(`Email: ${entry.email}`, 20, 40);

        // Add Schedule Operations
        doc.setFontSize(12); // Slightly bigger for sections
        doc.setFont("helvetica", "bold");
        doc.text("Schedule Operations:", 20, 50);
        let yPos = 60;

        predefinedChecklist.scheduleOperations.forEach((item, index) => {
            doc.setFontSize(10); // Reduce font size for items
            doc.setFont("helvetica", "normal");
            const operationStatus =
                entry.schedule_operations[index] === "yes"
                    ? "✔️ Yes"
                    : entry.schedule_operations[index] === "no"
                        ? "❌ No"
                        : "⚪ N/A"; // Handle the "n/a" case
            doc.text(`${item}: ${operationStatus}`, 20, yPos);

            yPos += 6; // Reduce spacing
            if (yPos > 270) { // Check if we are too close to the bottom of the page
                doc.addPage();
                yPos = 20; // Reset the y position on a new page
            }
        });

        // Add Flight Dispatch
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Flight Dispatch:", 20, yPos);
        yPos += 10;

        predefinedChecklist.flightDispatch.forEach((item, index) => {
            doc.setFontSize(10); // Smaller font size for items
            doc.setFont("helvetica", "normal");
            const dispatchStatus =
                entry.flight_dispatch[index] === "yes"
                    ? "✔️ Yes"
                    : entry.flight_dispatch[index] === "no"
                        ? "❌ No"
                        : "⚪ N/A"; // Handle "n/a" or undefined cases
            doc.text(`${item}: ${dispatchStatus}`, 20, yPos);
            yPos += 6;
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
        });

        // Add Special Remark
        if (entry.remarks_history && entry.remarks_history.length > 0) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Special Remark:", 20, yPos);
            yPos += 10;

            entry.remarks_history.forEach((remark) => {
                doc.setFontSize(10); // Smaller font size for remarks
                doc.setFont("helvetica", "normal");
                const remarkText = `${new Date(remark.timestamp).toLocaleString()}: ${remark.text}`;
                const remarkLines = doc.splitTextToSize(remarkText, 180); // Split text to fit the page width
                doc.text(remarkLines, 20, yPos);
                yPos += remarkLines.length * 6; // Adjust spacing based on number of lines
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
            });
        } else {
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text("No special remarks available.", 20, yPos);
            yPos += 6;
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
        }

        // Add footer (optional)
        doc.setFontSize(8); // Smaller font size for footer
        doc.setFont("helvetica", "italic");
        doc.text("Generated on " + new Date().toLocaleString(), 20, yPos);

        // Save PDF
        doc.save(`checklist_${entry.id}.pdf`);
    };


    // Filter the checklist data based on search queries
    const filteredChecklistData = checklistData.filter((entry) => {
        const matchesTime =
            timeSearchQuery === null ||
            new Date(entry.createdAt).setHours(0, 0, 0, 0) === timeSearchQuery.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
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
            <h2>Checklist Page</h2>

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
                    <div key={entry.id} className="checklist-entry">
                        {/* Title for the entry */}
                        <h3
                            className="checklist-title"
                            onClick={() => toggleEntry(entry.id)}
                            style={{ cursor: "pointer", color: "blue" }}
                        >
                            {expandedEntry === entry.id ? "▼ Checklist " : "► Checklist "} - {entry.createdAt} - {entry.email}
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
