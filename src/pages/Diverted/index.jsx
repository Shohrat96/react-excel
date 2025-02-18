import React, { useState } from "react";
import styles from "./Diverted.module.css";
import { calcGeneratorDuration } from "framer-motion";

const Diverted = () => {
    const [flights, setFlights] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [originalFlights, setOriginalFlights] = useState([]);
    const [openedFlightIds, setOpenedFlightIds] = useState([]);

    // Toggle function for flight diversion row
    const toggleDiversionRow = (id) => {
        setFlights(flights.map(flight =>
            flight.id === id ? { ...flight, showDiversion: !flight.showDiversion } : flight
        ));
    };

    // Save all flight data
    const saveAllData = () => {
        // Here you would typically save all data to your backend
        console.log(flights)
        alert("All flight data saved successfully!");
        setOriginalFlights(flights); // Save the state as original data
        setOpenedFlightIds([]); // Reset opened flight tracking
        setIsEditing(false);
    };

    // Function to track when a flight field is modified (called in onChange handlers)
    const trackFlightModification = (flightId) => {
        // If this flight ID isn't already in the openedFlightIds array, add it
        if (!openedFlightIds.includes(flightId)) {
            setOpenedFlightIds([...openedFlightIds, flightId]);
        }
    };

    // Cancel editing - delete one by one, last opened canceled first
    const cancelEditing = () => {
        if (openedFlightIds.length > 0) {
            // Get the last opened flight ID
            const lastOpenedId = openedFlightIds[openedFlightIds.length - 1];

            // Remove this flight from the flights array
            const updatedFlights = flights.filter(flight => flight.id !== lastOpenedId);

            // Update flights state
            setFlights(updatedFlights);

            // Update opened flights IDs by removing the last ID
            setOpenedFlightIds(openedFlightIds.slice(0, -1));

            // If there are no more opened flights, exit editing mode
            if (openedFlightIds.length === 1) {
                setIsEditing(false);
            }
        } else {
            // If no flights were opened/modified, just revert to original and exit editing mode
            setFlights(originalFlights);
            setIsEditing(false);
        }
    };

    // Add a new flight row
    const addNewFlight = () => {
        const newId = flights.length > 0 ? Math.max(...flights.map(f => f.id)) + 1 : 1;
        const newFlight = {
            id: newId,
            nbr: flights.length + 1,
            date: "",
            flightNumber: "",
            aircraft: "",
            departureAirport: "",
            std: "",
            atd: "",
            destinationAirport: "",
            sta: "",
            crewCat: "",
            destAltn: "",
            extraFuel: "",
            showDiversion: false,
            diversionData: "",
            divertCause: "",
            tafInBP: "",
            tafBeforeTakeOff: "",
            metarInBP: "",
            metarBeforeTakeOff: "",
            metarArrivalTime: "",
            planningAfterToDivert: "",
            remarks: ""
        };
        const updatedFlights = [...flights, newFlight];
        setFlights(updatedFlights);
        setOpenedFlightIds([...openedFlightIds, newId]); // Track the new flight
        setIsEditing(true);
    };

    // Helper function to create onChange handlers that track modifications
    const createChangeHandler = (flightId, field) => (e) => {
        trackFlightModification(flightId);
        setFlights(flights.map(f =>
            f.id === flightId ? { ...f, [field]: e.target.value } : f
        ));
    };

    // TextArea style for consistency
    const TextAreaStyle = {
        width: "100%",
        minWidth: "150px",
        minHeight: "40px",
        padding: "4px",
        resize: "both"
    };

    // Button styles for add, save, and cancel
    const ButtonStyle = {
        padding: "8px 16px",
        margin: "0 8px",
        backgroundColor: "#34495e",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
    };

    const CancelButtonStyle = {
        ...ButtonStyle,
        backgroundColor: "#f44336"
    };

    return (
        <div className={styles.container || ''}>
            <div className={styles.tableContainer || ''} style={{ overflowX: 'auto' }}>
                <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th>NB.</th>
                            <th>TARİH</th>
                            <th>FLIGHT NUMBER</th>
                            <th>AIRCRAFT</th>
                            <th>DEPARTURE AIRPORT</th>
                            <th>STD (UTC)</th>
                            <th>ATD (UTC)</th>
                            <th>DESTINATION AIRPORT (CAT)</th>
                            <th>STA (UTC)</th>
                            <th>CREW CAT</th>
                            <th>DEST ALTN</th>
                            <th>EXTRA FUEL</th>
                            <th>DIVERT AIRPORT</th>
                            <th>ATA (DIVERT AIRPORT)</th>
                            <th>DIVERT CAUSE</th>
                            <th>TAF (IN BP)</th>
                            <th>TAF (BEFORE TAKE-OFF)</th>
                            <th>METAR (IN BP)</th>
                            <th>METAR (BEFORE TAKE-OFF)</th>
                            <th>METAR (ARRIVAL TIME)</th>
                            <th>PLANNING AFTER TO DIVERT</th>
                            <th>REMARKS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flights.map((flight, index) => (
                            <tr key={flight.id}>
                                <td>{flight.nbr}</td>

                                {/* Start from index 1 - Using the createChangeHandler */}
                                <td><textarea style={TextAreaStyle} value={flight.date} onChange={createChangeHandler(flight.id, 'date')} /></td>
                                <td><textarea style={TextAreaStyle} value={flight.flightNumber} onChange={createChangeHandler(flight.id, 'flightNumber')} /></td>
                                <td><textarea style={TextAreaStyle} value={flight.aircraft} onChange={createChangeHandler(flight.id, 'aircraft')} /></td>
                                <td><textarea style={TextAreaStyle} value={flight.departureAirport} onChange={createChangeHandler(flight.id, 'departureAirport')} /></td>
                                <td><textarea style={TextAreaStyle} value={flight.std} onChange={createChangeHandler(flight.id, 'std')} /></td>
                                <td><textarea style={TextAreaStyle} value={flight.atd} onChange={createChangeHandler(flight.id, 'atd')} /></td>
                                <td><textarea style={TextAreaStyle} value={flight.destinationAirport} onChange={createChangeHandler(flight.id, 'destinationAirport')} /></td>
                                <td><textarea style={TextAreaStyle} value={flight.sta} onChange={createChangeHandler(flight.id, 'sta')} /></td>
                                <td><textarea style={TextAreaStyle} value={flight.crewCat} onChange={createChangeHandler(flight.id, 'crewCat')} /></td>
                                <td><textarea style={TextAreaStyle} value={flight.destAltn} onChange={createChangeHandler(flight.id, 'destAltn')} /></td>
                                <td><textarea style={TextAreaStyle} value={flight.extraFuel} onChange={createChangeHandler(flight.id, 'extraFuel')} /></td>
                                <td><textarea style={TextAreaStyle} value={flight.divertair} onChange={createChangeHandler(flight.id, 'divertair')} /></td>
                                <td>
                                    <textarea
                                        style={TextAreaStyle}
                                        value={flight.ata}
                                        onChange={createChangeHandler(flight.id, 'ata')}
                                    />
                                </td>

                                <td><textarea style={TextAreaStyle} value={flight.divertCause} onChange={createChangeHandler(flight.id, 'divertCause')} /></td>
                                <td><textarea style={TextAreaStyle} value={flight.tafInBP} onChange={createChangeHandler(flight.id, 'tafInBP')} /></td>
                                <td><textarea style={TextAreaStyle} value={flight.tafBeforeTakeOff} onChange={createChangeHandler(flight.id, 'tafBeforeTakeOff')} /></td>
                                <td><textarea style={TextAreaStyle} value={flight.metarInBP} onChange={createChangeHandler(flight.id, 'metarInBP')} /></td>
                                <td><textarea style={TextAreaStyle} value={flight.metarBeforeTakeOff} onChange={createChangeHandler(flight.id, 'metarBeforeTakeOff')} /></td>
                                <td><textarea style={TextAreaStyle} value={flight.metarArrivalTime} onChange={createChangeHandler(flight.id, 'metarArrivalTime')} /></td>
                                <td><textarea style={TextAreaStyle} value={flight.planningAfterToDivert} onChange={createChangeHandler(flight.id, 'planningAfterToDivert')} /></td>
                                <td><textarea style={TextAreaStyle} value={flight.remarks} onChange={createChangeHandler(flight.id, 'remarks')} /></td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-start", gap: "10px" }}>
                <button style={ButtonStyle} onClick={addNewFlight}>Add New Divert</button>
                <button style={ButtonStyle} onClick={saveAllData}>Save</button>
                <button style={CancelButtonStyle} onClick={cancelEditing}>Cancel</button>
            </div>
        </div>
    );
};

export default Diverted;