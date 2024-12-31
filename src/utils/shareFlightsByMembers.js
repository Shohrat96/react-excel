export const shareFlightsByMembers = (flights, memberCount) => {

  if (flights.length === 0) return {};
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
