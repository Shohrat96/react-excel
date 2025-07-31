import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectFlightsFilter, setSearchTerm, setSelectedDestinations, setFlightListToFilter, setSelectedShift, resetState } from "../../redux/slice/workload";
import { shareFlightsByMembers } from "../../utils/shareFlightsByMembers";
import { groupFlightsByLegs } from "../../utils/readFlightsFromExcel";
import CustomFileInput from "../../components/CustomFileInput";
import SelectInput from "../../components/CustomSelectElement";
import Dropdown from "../../components/CustomDropDown";
import RadioButton from "../../components/RadioBtn";
import SingleMember from "../../components/SingleMember";
import handleFileUpload from "../../utils/readFlightsFromExcel";
import { WORKLOAD_TABLE_HEADERS } from "../../types/constants";
import styles from "./Workload.module.css";

const SHIFT_OPTIONS = ["day", "night", "all"];

const WorkloadPage = () => {
    const { flightListToFilter, filteredFlightList, searchTerm, selectedDestinations, selectedShift } = useSelector(selectFlightsFilter)

    const [members, setMembers] = useState(1);
    const dispatch = useDispatch()

    const uniqueDestinations = [...new Set(flightListToFilter.map(flight => flight.destination))];

    const onSelect = (v) => {
        setMembers(v.target.value);
    };

    // Function to handle search term update
    const handleSearchChange = (e) => {
        dispatch(setSearchTerm(e.target.value));
    };

    const filteredData = useMemo(() => {
        if (!flightListToFilter) return null;
        let dataToFilter = flightListToFilter;

        if (selectedShift === "day" || selectedShift === "night") {
            dataToFilter = filteredFlightList
        }

        let filtered = dataToFilter.filter(Boolean).filter(row => {

            if (searchTerm) {
                return Object.values(row).some(value => {
                    if (selectedDestinations.length) {
                        return String(value).toLowerCase().includes(searchTerm.toLowerCase()) && (selectedDestinations.includes(row.destination) || selectedDestinations.includes(row.origin))
                    }
                    return String(value).toLowerCase().includes(searchTerm.toLowerCase())
                }
                );
            }
            if (selectedDestinations?.length > 0) {
                return (selectedDestinations.includes(row.destination) || selectedDestinations.includes(row.origin));
            }

            return true;
        });

        // Ensure all flights have cleaned_flight_number field for grouping
        const processedFlights = filtered.map(flight => {
            if (!flight.cleaned_flight_number) {
                // If cleaned_flight_number doesn't exist, create it from flight_number
                const rawFlightNumber = flight.flight_number;
                const cleanedFlightNumber = rawFlightNumber ? rawFlightNumber.toString().replace(/[.A-Za-z]+$/, "").trim() : "";
                return {
                    ...flight,
                    cleaned_flight_number: cleanedFlightNumber
                };
            }
            return flight;
        });

        console.log('Before grouping:', processedFlights.map(f => ({ flight: f.flight_number, cleaned: f.cleaned_flight_number, date: f.date })));

        // Apply grouping logic to ensure flights are properly paired
        const grouped = groupFlightsByLegs(processedFlights);

        console.log('After grouping:', grouped.map(f => ({ flight: f.flight_number, cleaned: f.cleaned_flight_number, date: f.date })));

        return grouped;
    }, [flightListToFilter, filteredFlightList, searchTerm, selectedDestinations, selectedShift]);

    const membersData = useMemo(() => {
        if (filteredData?.length > 0) {

            return shareFlightsByMembers(filteredData, members);
        }
        return {};
    }, [members, filteredData]);


    const sortedDestinations = (uniqueDestinations || []).slice().sort((a, b) => {
        const aIndex = (selectedDestinations || []).indexOf(a);
        const bIndex = (selectedDestinations || []).indexOf(b);

        if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
        } else if (aIndex !== -1) {
            return -1;
        } else if (bIndex !== -1) {
            return 1;
        } else {
            return 0;
        }
    });


    const handleCheckboxChange = (e) => {
        const value = e.target.value;
        let updatedDestinations = selectedDestinations || [];  // Ensure it's always an array

        if (updatedDestinations.includes(value)) {
            updatedDestinations = updatedDestinations.filter((dest) => dest !== value);
        } else {
            updatedDestinations = [...updatedDestinations, value];
        }

        dispatch(setSelectedDestinations(updatedDestinations));
    };

    const handleShiftSelect = (val) => {
        dispatch(setSelectedShift(val))
    }

    return (
        <div className={styles.container}>
            <div className={styles.fileInputMemberWrapper}>
                <CustomFileInput handleFileUpload={(e) => {
                    handleFileUpload(e, (data) => {
                        dispatch(setFlightListToFilter(data));
                        dispatch(resetState())
                    }, { noHeston: true })
                }} />
                <SelectInput onSelect={onSelect} disabled={!flightListToFilter?.length} />
            </div>
            {
                flightListToFilter.length ? (
                    <div className={styles.control}>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className={styles.controlInput}
                        />

                        <Dropdown destinations={sortedDestinations} selectedDestinations={selectedDestinations} handleCheckboxChange={handleCheckboxChange} />

                        <RadioButton options={SHIFT_OPTIONS} onSelect={handleShiftSelect} selected={selectedShift} />
                    </div>
                ) : null
            }


            <div className={styles.flightTableWrapper}>
                {Object.keys(membersData)?.length
                    ? Object.keys(membersData).map((singleMember) => (
                        <SingleMember
                            key={singleMember}
                            headers={WORKLOAD_TABLE_HEADERS}
                            member={singleMember}
                            data={membersData[singleMember].filter(item => Boolean(item))}
                        // setData={setData}
                        />
                    ))
                    : null}
            </div>
        </div>
    )
}

export default WorkloadPage;