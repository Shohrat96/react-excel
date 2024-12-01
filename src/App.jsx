import { useState, useCallback, useRef, useMemo } from "react";
import * as XLSX from "xlsx";
import CustomFileInput from "./components/CustomFileInput";
import SingleMember from "./components/SingleMember";
import "./styles.css";
import { shareFlightsByMembers } from "./utils/shareFlightsByMembers";
import SelectInput from "./components/CustomSelectElement";

function App() {
  const [data, setData] = useState([]);
  const [members, setMembers] = useState(1);

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      const clearedData = parsedData.filter((item) => {
        return Object.keys(item).length >= 7;
      });
      setData(clearedData);
    };
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
    <div className="text-center text-blue-900">
      <div className="text-blue-900">
        <CustomFileInput handleFileUpload={handleFileUpload} />

        <SelectInput onSelect={onSelect} disabled={!data?.length} />
      </div>
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
  );
}

export default App;
