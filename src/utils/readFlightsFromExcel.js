import dayjs from "dayjs";
import * as XLSX from "xlsx";
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);


const handleFileUpload = (e, cb) => {
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
            date: idx > 0 ? dayjs(date, 'DD.MM.YYYY').format('YYYY-MM-DD') : "Date",
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
    // Flatten and slice the combined data
    const flattenedData = allData.flat().slice(1);

    // Sort the data by the `date` field in ascending order
    const sortedData = flattenedData.sort((a, b) => {
      const dateA = dayjs(a.date, "YYYY-MM-DD");
      const dateB = dayjs(b.date, "YYYY-MM-DD");
      return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
    });

    // Pass the sorted data to the callback
    cb(sortedData);
  });
};

export default handleFileUpload