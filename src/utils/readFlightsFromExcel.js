import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { excelDateToJSDate } from "./convertExcelDateIntoReactDate";
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

// Helper function to clean flight number
const cleanFlightNumber = (flightNumber) => {
  if (!flightNumber) return "";
  // Remove dots, letters, and special characters from the end
  return flightNumber.toString().replace(/[.A-Za-z]+$/, "").trim();
};

// Helper function to extract numeric part of flight number
const getNumericFlightNumber = (flightNumber) => {
  const cleaned = cleanFlightNumber(flightNumber);
  const numericMatch = cleaned.match(/^(\d+)/);
  return numericMatch ? parseInt(numericMatch[1]) : 0;
};

// Helper function to group flights by legs
export const groupFlightsByLegs = (flights) => {
  const groupedFlights = [];
  const processedIndices = new Set();

  for (let i = 0; i < flights.length; i++) {
    if (processedIndices.has(i)) continue;

    const currentFlight = flights[i];
    const currentDate = currentFlight.date;
    const currentFlightNum = getNumericFlightNumber(currentFlight.cleaned_flight_number);

    // Find the corresponding return flight (consecutive number)
    let returnFlightIndex = -1;
    for (let j = i + 1; j < flights.length; j++) {
      if (processedIndices.has(j)) continue;

      const candidateFlight = flights[j];
      const candidateFlightNum = getNumericFlightNumber(candidateFlight.cleaned_flight_number);

      // Check if this is the return flight (consecutive number)
      if (candidateFlightNum === currentFlightNum + 1 || candidateFlightNum === currentFlightNum - 1) {
        // Verify it's actually a return leg by checking origin/destination
        if (candidateFlight.origin === currentFlight.destination &&
          candidateFlight.destination === currentFlight.origin) {

          // Check if dates are the same or consecutive (for overnight flights)
          const dateA = dayjs(currentDate, "YYYY-MM-DD");
          const dateB = dayjs(candidateFlight.date, "YYYY-MM-DD");
          const daysDiff = dateB.diff(dateA, 'day');

          // Allow same date or consecutive dates (0 or 1 day difference)
          if (daysDiff >= 0 && daysDiff <= 1) {
            returnFlightIndex = j;
            break;
          }
        }
      }
    }

    // Add the departure flight
    groupedFlights.push(currentFlight);
    processedIndices.add(i);

    // Add the return flight if found
    if (returnFlightIndex !== -1) {
      groupedFlights.push(flights[returnFlightIndex]);
      processedIndices.add(returnFlightIndex);
    }
  }

  // Add any remaining unprocessed flights
  for (let i = 0; i < flights.length; i++) {
    if (!processedIndices.has(i)) {
      groupedFlights.push(flights[i]);
    }
  }

  return groupedFlights;
};

const handleFileUpload = (e, cb, config) => {

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
            (config?.noHeston ? !item["__EMPTY_4"].includes("LY-") : true)

          );
        });

        clearedData = clearedData.map((item, idx) => {
          const rawFlightNumber = item["__EMPTY_2"];
          const cleanedFlightNumber = cleanFlightNumber(rawFlightNumber);

          return {
            date: idx > 0 ? excelDateToJSDate(item["__EMPTY_1"]) : "Date",
            flight_number: rawFlightNumber, // Show original flight number in UI
            cleaned_flight_number: cleanedFlightNumber, // Use cleaned version for calculations
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

    // Group flights by legs (departure/arrival pairs)
    const groupedData = groupFlightsByLegs(sortedData);

    console.log('groupedData: ', groupedData);
    cb(groupedData);
  });
};

export default handleFileUpload