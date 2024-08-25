import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { DataContext } from "./main";

interface AppProps {}

export default function ScannerPage({}: AppProps) {
  const { setResname } = useContext(DataContext);
  const navigate = useNavigate();

  function handleScan(result: string | null) {
    if (result) {
      console.log(result);
      setResname(result);
      navigate(`/restaurant/${result}`);
    }
  }

  return (
    <div className="mobile-responsive onlyMobile">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "30% 0 5rem 0",
        }}
      >
        <h1 className="bottom-menu heading-cart">Scan Code</h1>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "300px", height: "100%" }}>
          <Scanner
            onScan={(result) => handleScan(result?.[0]?.rawValue ?? null)}
          />
        </div>
      </div>
    </div>
  );
}
