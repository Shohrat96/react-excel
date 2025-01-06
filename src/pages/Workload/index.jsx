import { useMemo, useState, useEffect } from "react";
import SelectInput from "../../components/CustomSelectElement"
import SingleMember from "../../components/SingleMember";
import { WORKLOAD_TABLE_HEADERS } from "../../types/constants";
import { shareFlightsByMembers } from "../../utils/shareFlightsByMembers";
import styles from "./Workload.module.css";
import handleFileUpload from "../../utils/readFlightsFromExcel";
import CustomFileInput from "../../components/CustomFileInput";
import Dropdown from "../../components/CustomDropDown";

const WorkloadPage = () => {

    const [members, setMembers] = useState(1);
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedDestinations, setSelectedDestinations] = useState([]);
    const [destinations, setDestinations] = useState([]);
    // const destinations = [...new Set(data.map(flight => flight.destination))]; // Extract unique destinations from data


    useEffect(() => {
        // Update destinations whenever `data` changes
        const uniqueDestinations = [...new Set(data.map(flight => flight.destination))];
        setDestinations(uniqueDestinations);
    }, [data]);

    const onSelect = (v) => {
        setMembers(v.target.value);
    };

    // Function to handle search term update
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };


    const filteredData = useMemo(() => {
        if (!data) return null;
        return data.filter(Boolean).filter(row => {

            if (searchTerm) {
                return Object.values(row).some(value => {
                    if (selectedDestinations.length) {
                        return String(value).toLowerCase().includes(searchTerm.toLowerCase()) && (selectedDestinations.includes(row.destination) || selectedDestinations.includes(row.origin))
                    }
                    return String(value).toLowerCase().includes(searchTerm.toLowerCase())
                }
                );
            }
            if (selectedDestinations.length > 0) {
                return (selectedDestinations.includes(row.destination) || selectedDestinations.includes(row.origin));
            }

            return true;
        });
    }, [data, searchTerm, selectedDestinations]);

    const membersData = useMemo(() => {
        if (filteredData?.length > 0) {
            return shareFlightsByMembers(filteredData, members);
        }
        return {};
    }, [members, filteredData]);


    const sortedDestinations = destinations.sort((a, b) => {
        const aIndex = selectedDestinations.indexOf(a);
        const bIndex = selectedDestinations.indexOf(b);

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
        setSelectedDestinations((prev) => {
            if (prev.includes(e.target.value)) {
                return prev.filter((dest) => dest !== e.target.value);
            }
            return [...prev, e.target.value];
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.fileInputMemberWrapper}>
                <CustomFileInput handleFileUpload={(e) => {
                    handleFileUpload(e, setData)
                }} />
                <SelectInput onSelect={onSelect} disabled={!data?.length} />
            </div>
            {
                data.length ? (
                    <div className={styles.control}>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className={styles.controlInput}
                        />

                        <Dropdown destinations={sortedDestinations} selectedDestinations={selectedDestinations} handleCheckboxChange={handleCheckboxChange} />
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