import React from "react";

export function formatTAFData(rawTAF) {
  if (!rawTAF) return rawTAF;

  // Split the raw TAF string into lines based on `TEMPO` and `BECMG` keywords
  return rawTAF
    .replace(/(TEMPO|FM|BECMG)/g, "\n$1") // Add a newline before TEMPO and BECMG
    .split("\n") // Split the string into lines
    .map((line, index) => {
      if (line.startsWith("TEMPO") || line.startsWith("BECMG") || line.startsWith("FM")) {
        // Bold the TEMPO or BECMG parts
        const [keyword, ...rest] = line.split(" ");
        return (
          <div key={index}>
            <strong>{keyword}</strong> {rest.join(" ")}
          </div>
        );
      }
      return <div key={index}>{line}</div>;
    });
}
