import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { excelDateToJSDate } from "./convertExcelDateIntoReactDate";
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);


const handleFileUpload = (e, cb) => {

  const files = e.target.files;
  if (!files.length) return;
  const filePromises = Array.from(files).map((file, idx) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);

        let clearedData = parsedData.filter((item) => {
          return (
            Object.keys(item).length >= 8 &&
            !item["__EMPTY_4"].includes("LY-")
          );
        });

        clearedData = clearedData.map((item, idx) => {

          return {
            date: idx > 0 ? excelDateToJSDate(item["__EMPTY_1"]) : "Date",
            flight_number: item["__EMPTY_2"],
            aircraft_type: item["__EMPTY_3"],
            reg_number: item["__EMPTY_4"],
            origin: item["__EMPTY_6"],
            ETD: item["__EMPTY_7"],
            destination: item["__EMPTY_8"],
            ETA: item["__EMPTY_9"],
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

    cb(sortedData);
  });
};

export default handleFileUpload