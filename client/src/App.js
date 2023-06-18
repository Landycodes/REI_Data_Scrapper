import React from "react";
import Table from "./components/pages/MainPage";
import VersionOne from "./components/pages/VersionOne";

export default function App() {
  document.title = "REI_Scrapper";
  return (
    <div id="container">
      <Table />
    </div>
  );
}
