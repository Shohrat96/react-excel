import { useState, useMemo, useCallback } from "react";
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


function MonitoringPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState(1);
    const [monitoringStarted, setMonitoringStarted] = useState(false)
    const [lastUpdatedWeather, setLastUpdatedWeather] = useState(null); // State to store the timestamp
    const [showWarningsOnly, setShowWarningsOnly] = useState(false);

    const { isLoading } = useWebSocket(setData, monitoringStarted, setLastUpdatedWeather)

    const membersData = useMemo(() => {
        if (data?.length > 0) {
            return shareFlightsByMembers(data, members);
        }
        return {};
    }, [members, data]);

    const handleUploadFlights = async () => {
        if (data.length) {
            try {
                setLoading(true)
                if (!monitoringStarted) {
                    const res = await uploadFlightList(data)
                }
                const getFlights = await getFlightListWithTaf()
                if (getFlights?.status === 200) {
                    setData(getFlights?.data)
                    setMonitoringStarted(true)
                    setLastUpdatedWeather(dayjs().utc().format("YYYY-MM-DD HH:mm:ss"))
                } else {
                    setMonitoringStarted(false)
                    throw new Error("Error in fetching flight data");
                }

            } catch (error) {
                console.log("error in uploading flights list");

            } finally {
                setLoading(false)
            }
        } else {
            alert("No data available to upload")
        }
    }


    const toggleWarningsFilter = () => {
        setShowWarningsOnly((prev) => !prev);
    };

    const flightsTableData = useCallback((data) => {

        return data.filter((item) => {
            if (showWarningsOnly && !item?.isWarning) return false
            return true
        })

    }, [showWarningsOnly])


    return (
        <>
            <div className={styles.header}>
                <div className={styles.controlsWrapper}>
                    <CustomFileInput handleFileUpload={(e) => {
                        setMonitoringStarted(false)
                        handleFileUpload(e, setData)
                    }} />
                    <div className={styles.selectAndUpload}>
                        <CustomButton title={monitoringStarted ? "Refresh data" : "Start Monitoring"} handleClick={handleUploadFlights} />
                    </div>
                </div>

                <div className={styles.timeStamp}>
                    <span>Last update: {lastUpdatedWeather ? `${lastUpdatedWeather} UTC` : "Not Started"}</span>
                </div>

                <div className={styles.onlyAlerts}>
                    <CustomSliderComponent active={showWarningsOnly} toggleActive={toggleWarningsFilter} title="Alerts only" />
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
