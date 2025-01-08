import { useState, useMemo, useCallback, useEffect } from "react";
import dayjs from 'dayjs';
import { shareFlightsByMembers } from "../../utils/shareFlightsByMembers";
import CustomButton from "../../components/CustomBtn";
import uploadFlightList from "../../api/uploadFlightList";
import getFlightListWithTaf from "../../api/getFlightListWithTaf";
import useWebSocket from "../../webSocket";
import { FLIGHT_TABLE_HEADERS } from "../../types/constants";
import handleFileUpload from "../../utils/readFlightsFromExcel";
import CustomFileInput from "../../components/CustomFileInput";
import SingleMember from "../../components/SingleMember";
import styles from "./Monitoring.module.css";
import CustomSliderComponent from "../../components/CustomSlider";
import { useDispatch, useSelector } from "react-redux";
import { selectFlights, setFlightList, setLastUpdate, toggleMonitoring, toggleShowAlertsOnly } from "../../redux/slice/flightsSlice";
import restartWebsocket from "../../api/restartWebSocket";
import RemarksForm from "../../components/RemarksForm";


function MonitoringPage() {
    const dispatch = useDispatch()
    const { flightList, lastUpdate, monitoringStarted, showAlertsOnly } = useSelector(selectFlights)

    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState(1);
    // const [monitoringStarted, setMonitoringStarted] = useState(false)
    // const [lastUpdatedWeather, setLastUpdatedWeather] = useState(null); // State to store the timestamp
    const [showWarningsOnly, setShowWarningsOnly] = useState(false);
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

    const { isLoading } = useWebSocket(updateFlightsUI, monitoringStarted, setLastUpdatedWeather)

    const membersData = useMemo(() => {
        if (flightList?.length > 0) {
            return shareFlightsByMembers(flightList, members);
        }
        return {};
    }, [members, flightList]);

    const handleUploadFlights = async () => {
        if (flightList.length) {
            try {
                setLoading(true)
                if (!monitoringStarted) {
                    const res = await uploadFlightList(flightList)
                }
                const getFlights = await getFlightListWithTaf()
                const restartSocket = await restartWebsocket()

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
            if (showAlertsOnly && !item?.isWarning) return false
            return true
        })

    }, [showAlertsOnly])


    return (
        <>
            <div className={styles.header}>
                <div className={styles.controlsWrapper}>
                    <CustomFileInput handleFileUpload={(e) => {
                        setMonitoringStarted(false)
                        handleFileUpload(e, data => dispatch(setFlightList(data)))
                    }} />
                    <div className={styles.selectAndUpload}>
                        <CustomButton title={monitoringStarted ? "Refresh data" : "Start Monitoring"} handleClick={handleUploadFlights} />
                    </div>
                </div>

                <div className={styles.timeStamp}>
                    <span>Last update: {lastUpdate ? `${lastUpdate} UTC` : "Not Started"}</span>
                </div>

                <div className={styles.onlyAlerts}>
                    <CustomSliderComponent active={showAlertsOnly} toggleActive={toggleWarningsFilter} title="Alerts only" />
                    <div className={styles.controlsWrapper}>
                        {/* Add Remarks Button */}
                        <CustomButton
                            title="CheckList"
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
                    <div className={styles.spinner}></div>
                )
            }

        </>
    );
}

export default MonitoringPage;
