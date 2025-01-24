import React from "react";

export function formatTAFData(rawTAF) {
  if (!rawTAF) return rawTAF;

  // Split the raw TAF string into lines based on `TEMPO`, `BECMG`, etc.
  return rawTAF
    .replace(/(TEMPO|FM|BECMG|PROB30|PROB40|TAF)/g, "\n$1") // Add a newline before keywords
    .split("\n") // Split the string into lines
    .map((line, index) => {
      // Replace visibility values (4-digit numbers) with colored spans
      const parts = line.split(/\b(\d{4})\b/); // Split by visibility values

      return (
        <div key={index}>
          {parts.map((part, idx) => {
            if (/^\d{4}$/.test(part)) {
              // If part matches a 4-digit visibility value
              return (
                <span key={idx} style={{ color: "#986801" }}>
                  {part}
                </span>
              );
            }

            // Bold specific keywords (e.g., TEMPO, BECMG)
            if (
              idx === 0 &&
              (part.startsWith("TEMPO") ||
                part.startsWith("BECMG") ||
                part.startsWith("FM") ||
                part.startsWith("PROB30") ||
                part.startsWith("PROB40") ||
                part.startsWith("TAF"))
            ) {
              const [keyword, ...rest] = part.split(" ");
              return (
                <React.Fragment key={idx}>
                  <strong>{keyword}</strong> {rest.join(" ")}
                </React.Fragment>
              );
            }

            return part; // Return other parts as-is
          })}
        </div>
      );
    });
}

