import React, { useState } from "react";
import "../style.css";
import { lookUp } from "../../utils/API";

export default function Search() {
  const [getData, setData] = useState(false);
  // lookUp("tucson az").then((data) => setData(data));

  // getData ? console.log(getData.Location) : console.log("poop");

  return (
    <div className="d-flex flex-column align-items-center">
      <h1>REI data Scrapper</h1>
      <input id="location" placeholder="Enter city and state" />
      <button className="w-25 mt-2">+</button>
      <button
        className="w-50 mt-3"
        onClick={() => {
          const search = document.querySelector("#location").value;
          lookUp(search).then((data) => setData(data));
        }}
      >
        Search
      </button>

      {getData ? (
        <ul>
          <li>Location: {getData.Location}</li>
          <li>House growth value: {getData.MHV_Growth}</li>
          <li>House value: {getData.MedianHouseValue}</li>
          <li>Percentage of renters: {getData.PercentOfRenters}</li>
          <li>Population: {getData.Population}</li>
          <li>Population growth: {getData.PopulationGrowth}</li>
          <li>Average 3 bed cost: {getData.ThreeBedRent}</li>
          <li>Unemployment rate: {getData.Unemployment}</li>
          <li>Vacancy rate: {getData.VacancyRate}</li>
        </ul>
      ) : (
        ""
      )}
    </div>
  );
}
