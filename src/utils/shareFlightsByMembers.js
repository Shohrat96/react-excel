// Helper function to extract numeric part of flight number
const getNumericFlightNumber = (flightNumber) => {
  if (!flightNumber) return 0;
  // Remove dots, letters, and special characters from the end
  const cleaned = flightNumber.toString().replace(/[.A-Za-z]+$/, "").trim();
  const numericMatch = cleaned.match(/^(\d+)/);
  return numericMatch ? parseInt(numericMatch[1]) : 0;
};

// Helper function to find return leg flight number
const findReturnLegNumber = (departureFlight, allFlights) => {
  const departureNum = getNumericFlightNumber(departureFlight.cleaned_flight_number);
  const returnNum = departureNum + 1; // Return leg is always consecutive number

  // Find the return leg in all flights
  const returnFlight = allFlights.find(flight => {
    const flightNum = getNumericFlightNumber(flight.cleaned_flight_number);
    return flightNum === returnNum &&
      flight.origin === departureFlight.destination &&
      flight.destination === departureFlight.origin;
  });

  return returnFlight ? returnFlight.flight_number : `${returnNum}`;
};

// Helper function to convert time string to minutes for sorting
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper function to convert date string to timestamp for sorting
const dateToTimestamp = (dateStr) => {
  if (!dateStr) return 0;
  return new Date(dateStr).getTime();
};

export const shareFlightsByMembersWorkload = (flights, memberCount) => {
  if (flights.length === 0) return {};
  if (flights.length === 1) {
    return {
      member1: [flights[0]]
    }
  }

  const res = {};

  // Initialize member arrays
  for (let i = 1; i <= memberCount; i++) {
    res[`member${i}`] = [];
  }

  // Filter only departure legs (odd flight numbers)
  const departureLegs = flights.filter(flight => {
    const flightNum = getNumericFlightNumber(flight.cleaned_flight_number);
    return flightNum % 2 === 1; // Odd numbers are departure legs
  });

  // Sort departure legs by date first, then by ETD time
  const sortedDepartureLegs = departureLegs.sort((a, b) => {
    // First compare by date
    const dateA = dateToTimestamp(a.date);
    const dateB = dateToTimestamp(b.date);

    if (dateA !== dateB) {
      return dateA - dateB; // Earlier date comes first
    }

    // If same date, then compare by time
    const timeA = timeToMinutes(a.ETD);
    const timeB = timeToMinutes(b.ETD);
    return timeA - timeB; // Earlier time comes first
  });

  // Distribute departure legs among members in chronological order
  // This ensures dispatchers get flights with adequate time gaps
  sortedDepartureLegs.forEach((departureFlight, index) => {
    const memberIndex = (index % memberCount) + 1;
    const memberKey = `member${memberIndex}`;

    // Find the return leg number
    const returnLegNumber = findReturnLegNumber(departureFlight, flights);

    // Create simplified flight entry with combined flight number display
    const simplifiedFlight = {
      ...departureFlight,
      flight_number: `${departureFlight.flight_number}-${returnLegNumber}`, // Combined display
      return_leg_number: returnLegNumber,
      flight_pair: `${departureFlight.flight_number}-${returnLegNumber}`
    };

    res[memberKey].push(simplifiedFlight);
  });

  return res;
};

export const shareFlightsByMembersMonitoring = (flights, memberCount) => {

  if (flights.length === 0) return {};
  if (flights.length === 1) {
    return {
      member1: [flights[0]]
    }
  }
  const res = {};
  // res = { member1: [], member2: [] }

  for (let i = 1; i <= memberCount; i++) {
    res[`member${i}`] = [];
  }

  let turn = 1;

  let startIdx = 0;
  let endIdx = flights.length - 1;

  if (+flights[0]["flight_number"] !== +flights[1]["flight_number"] - 1) {
    startIdx = 1;
    res["member1"].push(flights[0]);
  }

  if (
    +flights[endIdx]["flight_number"] !==
    +flights[endIdx - 1]["flight_number"] + 1
  ) {
    endIdx = endIdx - 1;
  }

  for (let i = startIdx; i <= endIdx; i += 2) {
    for (let j = i; j < 2 + i; j++) {
      res[`member${turn}`].push(flights[j]);
    }
    turn = turn + 1 > memberCount ? 1 : turn + 1;
  }

  if (endIdx === flights.length - 2) {
    res[`member${memberCount}`].push(flights[flights.length - 1]);
  }

  return res;
};