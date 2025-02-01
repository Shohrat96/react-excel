import { useMemo, useState, useEffect } from "react";
import SelectInput from "../../components/CustomSelectElement"
import SingleMember from "../../components/SingleMember";
import { WORKLOAD_TABLE_HEADERS } from "../../types/constants";
import { shareFlightsByMembers } from "../../utils/shareFlightsByMembers";
import styles from "./Workload.module.css";
import handleFileUpload from "../../utils/readFlightsFromExcel";
import CustomFileInput from "../../components/CustomFileInput";
import Dropdown from "../../components/CustomDropDown";
import { useDispatch, useSelector } from "react-redux";
import { selectFlights } from "../../redux/slice/flightsSlice";
import { selectFlightsFilter, setFilteredFlightList, setFlightListToFilter, setSearchTerm, setSelectedDestinations, setSelectedShift } from "../../redux/slice/workload";
import RadioButton from "../../components/RadioBtn";


const SHIFT_OPTIONS = ["day", "night", "all"]


const WorkloadPage = () => {
    const { flightListToFilter, filteredFlightList, searchTerm, selectedDestinations, selectedShift } = useSelector(selectFlightsFilter)
    const state = useSelector(state => state)

    const [members, setMembers] = useState(1);
    const [data, setData] = useState([]);
    // const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch()

    // const [selectedDestinations, setSelectedDestinations] = useState([]);
    const [destinations, setDestinations] = useState([]);
    // const destinations = [...new Set(data.map(flight => flight.destination))]; // Extract unique destinations from data


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
        return dataToFilter.filter(Boolean).filter(row => {

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
    }, [flightListToFilter, searchTerm, selectedDestinations]);

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
                        // dispatch(setFilteredFlightList(data));
                    })
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