import React, { forwardRef } from "react";

const SingleMember = forwardRef(({ data, headers }, ref) => {
  return (
    <table className="table" ref={ref}>
      <thead>
        <tr>
          {Object.values(headers).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.map((row, index) => (
          <tr key={index}>
            {Object.values(row).map((value, index) => (
              <td key={index}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
});

export default SingleMember;
