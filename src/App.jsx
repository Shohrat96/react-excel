import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
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


const FLIGHT_TABLE_HEADERS = {
  date: "Date",
  flight_number: "FLT NBR",
  aircraft_type: "ACFT TYPE",
  reg_number: "REGN",
  origin: "DEP",
  ETD: "ETD",
  destination: "DES",
  ETA: "ETA",
  TAF_DEP: "TAF DEP",
  TAF_DEST: "TAF DEST",
  metar_dep: "METAR DEP",
  metar_dest: "METAR DEST",
}

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState(1);
  const [ monitoringStarted, setMonitoringStarted] = useState(false)
  const [lastUpdatedWeather, setLastUpdatedWeather] = useState(null); // State to store the timestamp

  const { isLoading, lastUpdatedWeatherFromSocket } = useWebSocket(setData, monitoringStarted)

  const handleFileUpload = (e) => {
    setMonitoringStarted(false)
    const files = e.target.files;
    const filePromises = Array.from(files).map((file, idx) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json(sheet);

          const date = parsedData[1]["__EMPTY_1"].split(" ")[1];

          let clearedData = parsedData.filter((item) => {
            return (
              Object.keys(item).length >= 7 &&
              !item["__EMPTY_3"].includes("LY-")
            );
          });
          clearedData = clearedData.map((item, idx) => {
            return {
              date: idx > 0 ? dayjs(date, 'DD.MM.YYYY').format('YYYY-DD-MM') : "Date",
              flight_number: item["__EMPTY_1"],
              aircraft_type: item["__EMPTY_2"],
              reg_number: item["__EMPTY_3"],
              origin: item["__EMPTY_4"],
              ETD: item["__EMPTY_6"],
              destination: item["__EMPTY_7"],
              ETA: item["__EMPTY_8"],
            };
          });

          resolve(idx === 0 ? clearedData : clearedData.slice(1));
        };

        reader.readAsBinaryString(file);
      });
    });

    Promise.all(filePromises).then((allData) => {
      setData(allData.flat().slice(1));
    });
  };

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
          if (res.status === 200) {
            setLastUpdatedWeather(dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]'))
          }          
        }
        const getFlights = await getFlightListWithTaf()
        if (getFlights?.status === 200) {
          setData(getFlights?.data)
          setMonitoringStarted(true)
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
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.controlsWrapper}>
          <CustomFileInput handleFileUpload={handleFileUpload} />
          <div className={styles.selectAndUpload}>
            <SelectInput onSelect={onSelect} disabled={!data?.length} />

            <CustomButton title={monitoringStarted ? "Refresh data" : "Start Monitoring"} handleClick={handleUploadFlights}/> 
          </div>
        </div>

      <div className={styles.timeStamp}>
        <span>Last update: {lastUpdatedWeatherFromSocket || lastUpdatedWeather || "Not Started"}</span>
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
  );
}

export default App;
