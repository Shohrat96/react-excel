import { useState, useMemo } from "react";
import dayjs from 'dayjs';
import CustomFileInput from "./components/CustomFileInput";
import SingleMember from "./components/SingleMember";
import styles from "./App.module.css";
import { shareFlightsByMembers } from "./utils/shareFlightsByMembers";
import SelectInput from "./components/CustomSelectElement";
import CustomButton from "./components/CustomBtn";
import uploadFlightList from "./api/uploadFlightList";
import getFlightListWithTaf from "./api/getFlightListWithTaf";
import useWebSocket from "./webSocket";
import { FLIGHT_TABLE_HEADERS } from "./types/constants";
import handleFileUpload from "./utils/readFlightsFromExcel";
import Sidebar from "./components/Sidebar";
import TimeSelector from "./components/TimeSelector";
import HeaderControls from "./components/HeaderControls";
import ScrollToTop from "./components/ScrollTopComponent";
import JeppesenDataPage from "./pages/jepessen";




function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState(1);
  const [monitoringStarted, setMonitoringStarted] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [lastUpdatedWeather, setLastUpdatedWeather] = useState(null); // State to store the timestamp

  const { isLoading } = useWebSocket(setData, monitoringStarted, setLastUpdatedWeather)

  const pathname = window.location.pathname;

  const membersData = useMemo(() => {
    if (data?.length > 0) {
      return shareFlightsByMembers(data, members);
    }
    return {};
  }, [members, data]);

  const onSelect = (v) => {
    setMembers(v.target.value);
  };


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


  if (pathname.startsWith('/jeppesen/')) {
    // Render the Jeppesen data page based on the current URL
    return <JeppesenDataPage />;
  }

  return (
    <div className={styles.container}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`${styles.main} ${collapsed ? styles.collapsed : ""}`}>
        <HeaderControls />
        <div className={styles.header}>
          <div className={styles.controlsWrapper}>
            <CustomFileInput handleFileUpload={(e) => {
              setMonitoringStarted(false)
              handleFileUpload(e, setData)
            }} />
            <div className={styles.selectAndUpload}>
              <SelectInput onSelect={onSelect} disabled={!data?.length} />

              <CustomButton title={monitoringStarted ? "Refresh data" : "Start Monitoring"} handleClick={handleUploadFlights} />
            </div>
          </div>

          <div className={styles.timeStamp}>
            <span>Last update: {lastUpdatedWeather ? `${lastUpdatedWeather} UTC` : "Not Started"}</span>
          </div>

          <div className={styles.onlyWithWarning}>

          </div>
        </div>
        <div className={styles.flightTableWrapper}>
          {Object.keys(membersData)?.length
            ? Object.keys(membersData).map((singleMember) => (
              <SingleMember
                key={singleMember}
                headers={FLIGHT_TABLE_HEADERS}
                member={singleMember}
                data={membersData[singleMember]}
              />
            ))
            : null}
        </div>

        {
          (loading || isLoading) && (
            <div className={styles.spinner}></div>
          )
        }
      </div>

      <ScrollToTop />
    </div>
  );
}

export default App;
