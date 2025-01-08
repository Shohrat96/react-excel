import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import CustomButton from "../CustomBtn";
import styles from "./RemarkForm.module.css";

function RemarksForm({ closeModal }) {
    const [checklist, setChecklist] = useState({
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
        ],
        remarks: "",
        remarksHistory: [] // make sure this is always an array
    });


    const [responses, setResponses] = useState({
        scheduleOperations: {},
        flightDispatch: {},
    });

    const [isRemarksVisible, setRemarksVisible] = useState(false);

    // Load remarks history from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem("remarksHistory");
        if (savedData) {
            setChecklist((prev) => ({
                ...prev,
                remarksHistory: JSON.parse(savedData),
            }));
        }
    }, []);

    const handleResponseChange = (section, index, value) => {
        setResponses((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [index]: value,
            },
        }));
    };

    const handleRemarkSubmit = () => {
        if (!checklist.remarks.trim()) return;

        const newRemark = {
            text: checklist.remarks,
            timestamp: new Date().toLocaleString(),
            id: Date.now(),
        };

        const updatedHistory = [...checklist.remarksHistory, newRemark];
        setChecklist((prev) => ({
            ...prev,
            remarks: "",
            remarksHistory: updatedHistory,
        }));

        localStorage.setItem("remarksHistory", JSON.stringify(updatedHistory));
    };

    const handleSave = async () => {
        const userName = localStorage.getItem('userName'); // Assuming userName is stored in localStorage after login
        if (!userName) {
            alert("User is not logged in.");
            return;
        }

        const requestData = {
            scheduleOperations: responses.scheduleOperations,
            flightDispatch: responses.flightDispatch,
            remarksHistory: checklist.remarksHistory,
            userName: userName, // Use userName from localStorage
        };
        console.log("Request Data:", requestData);

        try {
            const response = await fetch("/checklist/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                alert("Checklist saved successfully!");
                closeModal();
            } else {
                throw new Error("Failed to save checklist.");
            }
        } catch (error) {
            console.error("Error saving checklist:", error);
            alert("Failed to save checklist.");
        }
    };


    const ChecklistSection = ({ title, items, section }) => (
        <fieldset className={styles.section}>
            <legend>{title}</legend>
            {items && items.length > 0 ? ( // Check if items exist before calling .map()
                items.map((item, index) => (
                    <div key={index} className={styles.checklistItem}>
                        <label>{item}</label>
                        <div className={styles.radioGroup}>
                            {["yes", "no", "n/a"].map((value) => (
                                <label key={value} className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name={`${section}-${index}`}
                                        value={value}
                                        checked={responses[section]?.[index] === value}
                                        onChange={() =>
                                            handleResponseChange(section, index, value)
                                        }
                                    />
                                    {value.toUpperCase()}
                                </label>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p>No items to display</p> // Display message if items array is empty or undefined
            )}
        </fieldset>
    );

    return (
        <Modal closeModal={closeModal}>
            <div className={styles.checklistForm}>
                <h2>Dispatcher Duty Handover Form</h2>
                <div>
                    <ChecklistSection
                        title="Schedule and Operation"
                        items={checklist.scheduleOperations}
                        section="scheduleOperations"
                    />
                    <ChecklistSection
                        title="Flight Dispatch"
                        items={checklist.flightDispatch}
                        section="flightDispatch"
                    />
                </div>
                <div>
                    <h3>Special Remarks</h3>
                    <div className={styles.remarksSection}>
                        <textarea
                            className={styles.remarksTextarea}
                            placeholder="Enter any special remarks"
                            value={checklist.remarks}
                            onChange={(e) =>
                                setChecklist((prev) => ({
                                    ...prev,
                                    remarks: e.target.value,
                                }))
                            }
                        />
                        <button
                            className={styles.addRemarkButton}
                            onClick={handleRemarkSubmit}
                            disabled={!checklist.remarks.trim()}
                        >
                            Add Remark
                        </button>
                    </div>
                    <div>
                        <h4
                            className={styles.toggleRemarksTitle}
                            onClick={() => setRemarksVisible(!isRemarksVisible)}
                        >
                            Previous Remarks ({checklist.remarksHistory.length}){" "}
                            {isRemarksVisible ? "▲" : "▼"}
                        </h4>
                        {isRemarksVisible && (
                            <div className={styles.remarksHistory}>
                                {checklist.remarksHistory
                                    .slice()
                                    .reverse()
                                    .map((remark, index) => (
                                        <div key={remark.id} className={styles.remarkItem}>
                                            <span
                                                className={styles.remarkTimestamp}
                                            >{`${index + 1}. ${remark.timestamp}`}</span>
                                            <p className={styles.remarkText}>{remark.text}</p>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
                <CustomButton title="Save" handleClick={handleSave} />
            </div>
        </Modal>
    );
}

export default RemarksForm;