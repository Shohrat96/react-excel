import { useState, useCallback, useRef, useMemo } from "react";
import * as XLSX from "xlsx";
import CustomFileInput from "./components/CustomFileInput";
import SingleMember from "./components/SingleMember";
import styles from "./App.module.css";
import { shareFlightsByMembers } from "./utils/shareFlightsByMembers";
import SelectInput from "./components/CustomSelectElement";

function App() {
  const [data, setData] = useState([]);
  const [members, setMembers] = useState(1);

  const handleFileUpload = (e) => {
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

          const date = parsedData[1]["__EMPTY_1"].split(" ")[1]

          
          let clearedData = parsedData.filter((item) => {
            return Object.keys(item).length >= 7 && !item["__EMPTY_3"].includes("LY-");
          });
          clearedData = clearedData.map((item, idx) => {
            if (idx > 0) {
              return {
                date,
                ...item
              }
            } return {
              date: "Date",
              ...item,

            }
          })
          
          resolve(idx === 0 ? clearedData : clearedData.slice(1));
        };

        reader.readAsBinaryString(file);

      })
    })

    Promise.all(filePromises).then(allData => {
      setData(allData.flat())
    })
 
  };

  const membersData = useMemo(() => {
    if (data?.length > 0) {
      return shareFlightsByMembers(data.slice(1), members);
    }
    return {};
  }, [members, data]);

  const onSelect = (v) => {
    setMembers(v.target.value);
  };

  return (
    <div>
      <div>
        <CustomFileInput handleFileUpload={handleFileUpload} />

        <SelectInput onSelect={onSelect} disabled={!data?.length} />
      </div>
      <div className={styles.flightTableWrapper}>
        {Object.keys(membersData)?.length
          ? Object.keys(membersData).map((singleMember) => (
              <SingleMember
                key={singleMember}
                headers={data[0]}
                member={singleMember}
                data={membersData[singleMember]}
              />
            ))
          : null}
      </div>
    </div>
  );
}

export default App;
