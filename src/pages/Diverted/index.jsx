import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./Diverted.module.css";
import { toast } from "react-toastify";

const Diverted = () => {
    const [flights, setFlights] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [originalFlights, setOriginalFlights] = useState([]);
    const [openedFlightIds, setOpenedFlightIds] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSaveButton, setShowSaveButton] = useState(false);

    // Create a ref object to store references to textareas
    const textareaRefs = useRef({});

    // Fetch all flight data
    useEffect(() => {
        fetchFlights();
    }, []);

    const fetchFlights = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Log the API URL being called
            const apiUrl = `${process.env.REACT_APP_BASE_URL}/diverted/all`;

            const response = await axios.get(apiUrl, {
                // Add timeout and additional headers if needed
                timeout: 10000, // 10 second timeout
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            console.log('API Response:', response.data);

            if (!response.data) {
                throw new Error('No data received from the server');
            }

            // Ensure response.data is an array
            if (!Array.isArray(response.data)) {
                console.error('Unexpected response format:', response.data);
                throw new Error('Invalid data format received from server');
            }
            console.log('Flights:', response.data);

            // Transform the data to match our component's structure
            const transformedFlights = response.data.map((flight, index) => ({
                id: flight.id || index + 1,
                nbr: index + 1,
                date: flight.date || "",
                flightNumber: flight.flight_number || "",
                aircraft: flight.airc_type || "",
                departureAirport: flight.dep_airp || "",
                std: flight.std_utc || "",
                atd: flight.atd_utc || "",
                destinationAirport: flight.dest_airp_cat || "",
                sta: flight.sta_utc || "",
                crewCat: flight.crew_cat || "",
                destAltn: flight.dest_altn || "",
                extraFuel: flight.extra_fuel || "",
                divertair: flight.divert_airp || "",
                ata: flight.ata_divert_airport || "",
                divertCause: flight.divert_cause || "",
                tafInBP: flight.taf_in_bp || "",
                tafBeforeTakeOff: flight.taf_before_to || "",
                metarInBP: flight.metar_in_bp || "",
                metarBeforeTakeOff: flight.metar_before_to || "",
                metarArrivalTime: flight.metar_arr_time || "",
                planningAfterToDivert: flight.planning_after_divert || "",
                remarks: flight.remarks || ""
            }));

            console.log('Transformed flights:', transformedFlights);
            setFlights(transformedFlights);
            setOriginalFlights(transformedFlights);
            setIsLoading(false);

        } catch (error) {
            console.error("Detailed error information:", {
                message: error.message,
                response: error.response,
                request: error.request,
                config: error.config
            });

            let errorMessage = "Failed to load flight data. ";

            if (error.response) {
                // Server responded with an error
                errorMessage += `Server error: ${error.response.status} - ${error.response.statusText}`;
            } else if (error.request) {
                // Request was made but no response
                errorMessage += "No response received from server. Please check your connection.";
            } else if (error.message.includes('timeout')) {
                errorMessage += "Request timed out. Please try again.";
            } else {
                // Something else went wrong
                errorMessage += error.message;
            }

            setError(errorMessage);
            setIsLoading(false);
        }
    };

    // Function to add a new flight
    const addNewFlight = () => {
        const newId = flights.length > 0 ? Math.max(...flights.map(f => f.id)) + 1 : 1;

        // Check if a flight with the same values already exists
        const isDuplicate = flights.some(f => f.flightNumber === "" && f.date === "");
        if (isDuplicate) {
            toast.success("New Divert added successfully!");
            return;
        }

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
            divertair: "",
            ata: "",
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
        setOpenedFlightIds([...openedFlightIds, newId]);
        setIsEditing(true);
        setShowSaveButton(true);  // Enable the save button when a new flight is added
    };

    // Save new flight data
    const saveNewFlightData = async () => {
        try {
            setIsSaving(true);

            const newFlight = flights[flights.length - 1];

            // Validate all required fields
            const missingFields = [];
            Object.entries(newFlight).forEach(([key, value]) => {
                if (key !== 'id' && key !== 'nbr') { // Skip id and nbr fields
                    if (typeof value === 'string' && value.trim() === '') {
                        missingFields.push(key);
                    } else if (value === null || value === undefined || value === '') {
                        missingFields.push(key);
                    }
                }
            });

            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            const mappedFlight = {
                date: newFlight.date,
                flightNumber: newFlight.flightNumber,
                aircraft: newFlight.aircraft,
                departureAirport: newFlight.departureAirport,
                stdUtc: newFlight.std,
                atdUtc: newFlight.atd,
                destinationAirportCat: newFlight.destinationAirport,
                staUtc: newFlight.sta,
                crewCat: newFlight.crewCat,
                destAltn: newFlight.destAltn,
                extraFuel: newFlight.extraFuel,
                divertAirport: newFlight.divertair,
                ataDivertAirport: newFlight.ata,
                divertCause: newFlight.divertCause,
                tafInBp: newFlight.tafInBP,
                tafBeforeTakeoff: newFlight.tafBeforeTakeOff,
                metarInBp: newFlight.metarInBP,
                metarBeforeTakeoff: newFlight.metarBeforeTakeOff,
                metarArrivalTime: newFlight.metarArrivalTime,
                planningAfterDivert: newFlight.planningAfterToDivert,
                remarks: newFlight.remarks
            };

            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/diverted/save`,
                mappedFlight
            );

            if (!response.data) {
                throw new Error('Failed to save flight data');
            }

            // alert("New flight data saved successfully!");
            toast.success("New Divert added successfully!");
            await fetchFlights(); // Refresh the data after saving
            setIsEditing(false);
            setShowSaveButton(false); // Hide save button after successful save

        } catch (error) {
            console.error("Error saving flight data:", error);
            alert(error.message || "Failed to save flight data. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const createChangeHandler = (flightId, field) => (e) => {
        trackFlightModification(flightId);
        setFlights(flights.map(f =>
            f.id === flightId ? { ...f, [field]: e.target.value } : f
        ));

        // Auto-resize the textarea
        adjustTextareaHeight(e.target);
    };

    // New function to handle auto-resizing
    const adjustTextareaHeight = (textarea) => {
        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = 'auto';
        // Set the height to match the content
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    // Function to set a ref for a textarea with a unique key
    const setTextareaRef = (flightId, field, element) => {
        if (!element) return;

        const key = `${flightId}-${field}`;
        textareaRefs.current[key] = element;

        // Initial resize when the component mounts
        adjustTextareaHeight(element);
    };

    const trackFlightModification = (flightId) => {
        if (!openedFlightIds.includes(flightId)) {
            setOpenedFlightIds([...openedFlightIds, flightId]);
        }
    };

    const cancelEditing = () => {
        if (openedFlightIds.length > 0) {
            const lastOpenedId = openedFlightIds[openedFlightIds.length - 1];
            const updatedFlights = flights.filter(flight => flight.id !== lastOpenedId);
            setFlights(updatedFlights);
            setOpenedFlightIds(openedFlightIds.slice(0, -1));
            if (openedFlightIds.length === 1) {
                setIsEditing(false);
            }
        } else {
            setFlights(originalFlights);
            setIsEditing(false);
        }
        setShowSaveButton(false);
    };

    // Updated TextAreaStyle to work with auto-resizing
    const TextAreaStyle = {
        width: "100%",
        minWidth: "150px",
        minHeight: "40px",
        border: "none",
        outline: "none",
        padding: "4px",
        resize: "none", // Changed from "both" to "none" to let our JS handle resizing
        overflow: "hidden", // Hide scrollbars
        textAlign: "center",
    };

    const ButtonStyle = {
        padding: "8px 16px",
        margin: "0 8px",
        backgroundColor: "#34495e",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        opacity: isSaving ? 0.7 : 1,
        pointerEvents: isSaving ? "none" : "auto"
    };

    const CancelButtonStyle = {
        ...ButtonStyle,
        backgroundColor: "#f44336"
    };

    if (isLoading) {
        return <div className="text-center p-4">Loading flight data...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-600">{error}</div>;
    }

    return (
        <div className={styles.container || ''}>
            <div className={styles.tableContainer || ''} style={{ overflowX: 'auto' }}>
                <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead >
                        <tr>
                            <th>NB.</th>
                            <th>TARİH </th>
                            <th>FLIGHT NUMBER </th>
                            <th>AIRCRAFT </th>
                            <th>DEPARTURE AIRPORT </th>
                            <th>STD (UTC) </th>
                            <th>ATD (UTC) </th>
                            <th>DESTINATION AIRPORT (CAT) </th>
                            <th>STA (UTC) </th>
                            <th>CREW CAT </th>
                            <th>DEST ALTN </th>
                            <th>EXTRA FUEL </th>
                            <th>DIVERT AIRPORT </th>
                            <th>ATA (DIVERT AIRPORT) </th>
                            <th>DIVERT CAUSE </th>
                            <th>TAF (IN BP) </th>
                            <th>TAF (BEFORE TAKE-OFF) </th>
                            <th>METAR (IN BP) </th>
                            <th>METAR (BEFORE TAKE-OFF) </th>
                            <th>METAR (ARRIVAL TIME) </th>
                            <th>PLANNING AFTER TO DIVERT </th>
                            <th>REMARKS </th>
                        </tr>
                    </thead>
                    <tbody>
                        {flights.map((flight) => (
                            <tr key={flight.id}>
                                <td>{flight.nbr}</td>
                                <td><textarea
                                    style={TextAreaStyle}
                                    value={flight.date}
                                    onChange={createChangeHandler(flight.id, 'date')}
                                    ref={(el) => setTextareaRef(flight.id, 'date', el)}
                                /></td>
                                <td><textarea
                                    style={TextAreaStyle}
                                    value={flight.flightNumber}
                                    onChange={createChangeHandler(flight.id, 'flightNumber')}
                                    ref={(el) => setTextareaRef(flight.id, 'flightNumber', el)}
                                /></td>
                                <td><textarea
                                    style={TextAreaStyle}
                                    value={flight.aircraft}
                                    onChange={createChangeHandler(flight.id, 'aircraft')}
                                    ref={(el) => setTextareaRef(flight.id, 'aircraft', el)}
                                /></td>
                                <td><textarea
                                    style={TextAreaStyle}
                                    value={flight.departureAirport}
                                    onChange={createChangeHandler(flight.id, 'departureAirport')}
                                    ref={(el) => setTextareaRef(flight.id, 'departureAirport', el)}
                                /></td>
                                <td><textarea
                                    style={TextAreaStyle}
                                    value={flight.std}
                                    onChange={createChangeHandler(flight.id, 'std')}
                                    ref={(el) => setTextareaRef(flight.id, 'std', el)}
                                /></td>
                                <td><textarea
                                    style={TextAreaStyle}
                                    value={flight.atd}
                                    onChange={createChangeHandler(flight.id, 'atd')}
                                    ref={(el) => setTextareaRef(flight.id, 'atd', el)}
                                /></td>
                                <td><textarea
                                    style={TextAreaStyle}
                                    value={flight.destinationAirport}
                                    onChange={createChangeHandler(flight.id, 'destinationAirport')}
                                    ref={(el) => setTextareaRef(flight.id, 'destinationAirport', el)}
                                /></td>
                                <td><textarea
                                    style={TextAreaStyle}
                                    value={flight.sta}
                                    onChange={createChangeHandler(flight.id, 'sta')}
                                    ref={(el) => setTextareaRef(flight.id, 'sta', el)}
                                /></td>
                                <td><textarea
                                    style={TextAreaStyle}
                                    value={flight.crewCat}
                                    onChange={createChangeHandler(flight.id, 'crewCat')}
                                    ref={(el) => setTextareaRef(flight.id, 'crewCat', el)}
                                /></td>
                                <td><textarea
                                    style={TextAreaStyle}
                                    value={flight.destAltn}
                                    onChange={createChangeHandler(flight.id, 'destAltn')}
                                    ref={(el) => setTextareaRef(flight.id, 'destAltn', el)}
                                /></td>
                                <td><textarea
                                    style={TextAreaStyle}
                                    value={flight.extraFuel}
                                    onChange={createChangeHandler(flight.id, 'extraFuel')}
                                    ref={(el) => setTextareaRef(flight.id, 'extraFuel', el)}
                                /></td>
                                <td><textarea
                                    style={TextAreaStyle}
                                    value={flight.divertair}
                                    onChange={createChangeHandler(flight.id, 'divertair')}
                                    ref={(el) => setTextareaRef(flight.id, 'divertair', el)}
                                /></td>
                                <td><textarea
                                    style={TextAreaStyle}
                                    value={flight.ata}
                                    onChange={createChangeHandler(flight.id, 'ata')}
                                    ref={(el) => setTextareaRef(flight.id, 'ata', el)}
                                /></td>
                                <td><textarea
                                    style={TextAreaStyle}
                                    value={flight.divertCause}
                                    onChange={createChangeHandler(flight.id, 'divertCause')}
                                    ref={(el) => setTextareaRef(flight.id, 'divertCause', el)}
                                /></td>
                                <td><textarea
                                    style={TextAreaStyle}
                                    value={flight.tafInBP}
                                    onChange={createChangeHandler(flight.id, 'tafInBP')}
                                    ref={(el) => setTextareaRef(flight.id, 'tafInBP', el)}
                                /></td>
                                <td><textarea
                                    style={TextAreaStyle}
                                    value={flight.tafBeforeTakeOff}
                                    onChange={createChangeHandler(flight.id, 'tafBeforeTakeOff')}
                                    ref={(el) => setTextareaRef(flight.id, 'tafBeforeTakeOff', el)}
                                /></td>
                                <td><textarea
                                    style={TextAreaStyle}
                                    value={flight.metarInBP}
                                    onChange={createChangeHandler(flight.id, 'metarInBP')}
                                    ref={(el) => setTextareaRef(flight.id, 'metarInBP', el)}
                                /></td>
                                <td><textarea
                                    style={TextAreaStyle}
                                    value={flight.metarBeforeTakeOff}
                                    onChange={createChangeHandler(flight.id, 'metarBeforeTakeOff')}
                                    ref={(el) => setTextareaRef(flight.id, 'metarBeforeTakeOff', el)}
                                /></td>
                                <td><textarea
                                    style={TextAreaStyle}
                                    value={flight.metarArrivalTime}
                                    onChange={createChangeHandler(flight.id, 'metarArrivalTime')}
                                    ref={(el) => setTextareaRef(flight.id, 'metarArrivalTime', el)}
                                /></td>
                                <td><textarea
                                    style={TextAreaStyle}
                                    value={flight.planningAfterToDivert}
                                    onChange={createChangeHandler(flight.id, 'planningAfterToDivert')}
                                    ref={(el) => setTextareaRef(flight.id, 'planningAfterToDivert', el)}
                                /></td>
                                <td><textarea
                                    style={TextAreaStyle}
                                    value={flight.remarks}
                                    onChange={createChangeHandler(flight.id, 'remarks')}
                                    ref={(el) => setTextareaRef(flight.id, 'remarks', el)}
                                /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-start", gap: "10px" }}>
                <button style={ButtonStyle} onClick={addNewFlight} disabled={isSaving}>
                    Add New Divert
                </button>
                {showSaveButton && (
                    <button
                        style={ButtonStyle}
                        onClick={saveNewFlightData}
                        disabled={isSaving}>
                        Save
                    </button>
                )}
                <button style={CancelButtonStyle} onClick={cancelEditing} disabled={isSaving}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default Diverted;