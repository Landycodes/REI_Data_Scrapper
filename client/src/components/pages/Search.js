import React, { useState } from "react";
import "../style.css";
import { lookUp } from "../../utils/API";

export default function Search() {
  const [getData, setData] = useState();
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
          lookUp(search).then((data) => console.log(data));
        }}
      >
        Search
      </button>
    </div>
  );
}
