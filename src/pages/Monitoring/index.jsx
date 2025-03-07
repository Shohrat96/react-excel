import { useState, useMemo, useCallback, useEffect } from "react";
import dayjs from 'dayjs';
import { shareFlightsByMembers } from "../../utils/shareFlightsByMembers";
import CustomButton from "../../components/CustomBtn";
import uploadFlightList from "../../api/uploadFlightList";
import getFlightListWithTaf from "../../api/getFlightListWithTaf";
import useGetFlightsWithData from "../../webSocket";
import { FLIGHT_TABLE_HEADERS } from "../../types/constants";
import handleFileUpload from "../../utils/readFlightsFromExcel";
import CustomFileInput from "../../components/CustomFileInput";
import SingleMember from "../../components/SingleMember";
import styles from "./Monitoring.module.css";
import CustomSliderComponent from "../../components/CustomSlider";
import { useDispatch, useSelector } from "react-redux";
import { resetFlights, selectFlights, setFlightList, setLastUpdate, toggleMonitoring, toggleShowAlertsOnly, setSearchTerm, setFilteredFlightList } from "../../redux/slice/flightsSlice";
import restartWebsocket from "../../api/restartWebSocket";
import RemarksForm from "../../components/RemarksForm";
import CustomLoader from "../../components/CustomLoader";


function MonitoringPage() {
    const dispatch = useDispatch()
    const { flightList, lastUpdate, monitoringStarted, showAlertsOnly, searchTerm, filteredFlights } = useSelector(selectFlights)

    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState(1);

    const [showRemarksModal, setShowRemarksModal] = useState(false);


    const updateFlightsUI = useCallback((data) => {
        dispatch(setFlightList(data))
    }, [])
    const setLastUpdatedWeather = useCallback((data) => {
        dispatch(setLastUpdate(data))
    }, [])
    const setMonitoringStarted = useCallback((started) => {
        dispatch(toggleMonitoring(started))
    }, [])

    const { isLoading } = useGetFlightsWithData(updateFlightsUI, setLastUpdatedWeather)

    const membersData = useMemo(() => {
        if (searchTerm) {
            return shareFlightsByMembers(filteredFlights, members)
        }
        if (flightList?.length > 0) {
            return shareFlightsByMembers(flightList, members);
        }
        return {};
    }, [members, flightList, searchTerm, filteredFlights]);

    const handleUploadFlights = async () => {
        if (flightList.length) {
            try {
                setLoading(true)
                if (!monitoringStarted) {
                    const res = await uploadFlightList(flightList)
                }
                const getFlights = await getFlightListWithTaf()
                // const restartSocket = await restartWebsocket()

                if (getFlights?.status === 200) {
                    dispatch(setFlightList((getFlights?.data)))
                    setMonitoringStarted(true)
                    setLastUpdatedWeather(dayjs().utc().format("YYYY-MM-DD HH:mm:ss"))
                } else {
                    setMonitoringStarted(false)
                    throw new Error("Error in fetching flight data");
                }

            } catch (error) {
                console.log("error in uploading flightList list");

            } finally {
                setLoading(false)
            }
        } else {
            alert("No data available to upload")
        }
    }


    const toggleWarningsFilter = () => {
        dispatch(toggleShowAlertsOnly(!showAlertsOnly));
    };

    const flightsTableData = useCallback((data) => {

        return data.filter((item) => {
            if ((showAlertsOnly && !item?.isWarning) || !item) return false
            return true
        })

    }, [showAlertsOnly])

    const handleSearchChange = (e) => {
        const search = e.target.value?.trim();
        dispatch(setSearchTerm(search));
        dispatch(setFilteredFlightList(flightList.filter(row => {
            if (search) {
                return Object.values(row).some(value => {
                    return String(value).toLowerCase().includes(e.target.value.toLowerCase())
                });
            }
            return true;
        })))
    }

    return (
        <>
            <div className={styles.header}>
                <div className={styles.controlsWrapper}>
                    <div className={styles.fileInputMemberWrapper}>
                        <CustomFileInput handleFileUpload={(e) => {
                            setMonitoringStarted(false)
                            dispatch(resetFlights())
                            handleFileUpload(e, data => {
                                if (data.length > 0) {
                                    dispatch(setFlightList([...data]))
                                }
                            })
                        }} />
                        <div className={styles.timeStamp}>
                            <span>Last update: {lastUpdate ? `${lastUpdate} UTC` : "Not Started"}</span>
                        </div>
                    </div>

                    <div className={styles.selectAndUpload}>
                        <CustomButton title={monitoringStarted ? "Refresh data" : "Start Monitoring"} handleClick={handleUploadFlights} />

                        <div className={styles.control}>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className={styles.controlInput}
                            />

                            {/* <Dropdown destinations={sortedDestinations} selectedDestinations={selectedDestinations} handleCheckboxChange={handleCheckboxChange} /> */}
                        </div>

                    </div>
                </div>


                <div className={styles.onlyAlerts}>
                    <CustomSliderComponent active={showAlertsOnly} toggleActive={toggleWarningsFilter} title="Alerts only" />
                    <div className={styles.checkList}>
                        {/* Add Remarks Button */}
                        <CustomButton
                            title="Handover"
                            handleClick={() => setShowRemarksModal(true)}
                        />
                    </div>

                    {showRemarksModal && (
                        <RemarksForm closeModal={() => setShowRemarksModal(false)} />
                    )}
                </div>

            </div>

            <div className={styles.flightTableWrapper}>
                {Object.keys(membersData)?.length
                    ? Object.keys(membersData).map((singleMember) => (
                        <SingleMember
                            key={singleMember}
                            headers={FLIGHT_TABLE_HEADERS}
                            member={singleMember}
                            data={flightsTableData(membersData[singleMember])}
                        />
                    ))
                    : null}

            </div>


            {
                (loading || isLoading) && (
                    <CustomLoader />
                )
            }

        </>
    );
}

export default MonitoringPage;
