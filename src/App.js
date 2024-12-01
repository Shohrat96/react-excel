import { useState, useCallback, useRef, useMemo } from "react";
import * as XLSX from "xlsx";
import CustomFileInput from "./components/CustomFileInput";
import SingleMember from "./components/SingleMember";
import "./styles.css";
import { shareFlightsByMembers } from "./utils/shareFlightsByMembers";

function App() {
  const [data, setData] = useState([]);
  const [members, setMembers] = useState(1);

  const tableRef = useRef();

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

  const xport = useCallback(() => {
    /* Create worksheet from HTML DOM TABLE */
    const wb = XLSX.utils.table_to_book(tableRef.current);

    /* Export to file (start a download) */
    XLSX.writeFile(wb, "SheetJSTable.xlsx");
  });

  const membersData = useMemo(() => {
    if (data?.length > 0) {
      return shareFlightsByMembers(data.slice(1), members);
    }
    return {};
  }, [members, data]);

  const onSelect = (v) => {
    console.log("ev2: ", v.target.value);
    setMembers(v.target.value);
  };

  console.log("membersData usememo: ", membersData);

  return (
    <div className="text-center text-blue-900">
      <div className="text-blue-900">
        <CustomFileInput
          onChange={() => {}}
          handleFileUpload={handleFileUpload}
        />
        <div
          style={{
            display: "inline-block",
          }}
        >
          <select onChange={onSelect}>
            <option value={"1"}>1</option>
            <option value={"2"}>2</option>
            <option value={"3"}>3</option>
            <option value={"4"}>4</option>
          </select>
          <button onClick={xport}>
            <b className="text-red">Allocate</b>
          </button>
        </div>

        <div>
          <button onClick={xport}>
            <b className="text-red">Export XLSX!</b>
          </button>
        </div>
      </div>
      {Object.keys(membersData)?.length
        ? Object.keys(membersData).map((singleMember, idx) => (
            <SingleMember
              key={singleMember}
              headers={data[0]}
              ref={tableRef}
              data={membersData[singleMember]}
            />
          ))
        : null}
      <br />
      <br />
      ... webstylepress ...
    </div>
  );
}

export default App;
