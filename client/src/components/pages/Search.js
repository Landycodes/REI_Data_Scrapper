import React, { useState } from "react";
import "../style.css";
import { lookUp } from "../../utils/API";

export default function Search() {
  const [getData, setData] = useState(false);
  // lookUp("tucson az").then((data) => setData(data));

  // getData ? console.log(getData.Location) : console.log("poop");

  return (
    <div className="d-flex flex-column align-items-center">
      <h1 className="mt-4">REI data Scrapper</h1>
      <input id="location" placeholder="Enter city and state" />
      <button className="btn btn-light w-25 mt-2 p-0">
        <h4>+</h4>
      </button>
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
        getData.Location ? (
          <table className="table table-dark bg-dark mt-3 border border-white">
            <tbody className="p-2">
              <tr className="border border-white">
                <th>{getData.Location}</th>
              </tr>
              <tr>
                <td className="border border-white">House growth value </td>
                <td className="border border-white">{getData.MHV_Growth}</td>
              </tr>
              <tr>
                <td className="border border-white">House value </td>
                <td className="border border-white">
                  {getData.MedianHouseValue}
                </td>
              </tr>
              <tr>
                <td className="border border-white">Percentage of renters </td>
                <td className="border border-white">
                  {getData.PercentOfRenters}
                </td>
              </tr>
              <tr>
                <td className="border border-white">Population </td>
                <td className="border border-white">{getData.Population}</td>
              </tr>
              <tr>
                <td className="border border-white">Population growth </td>
                <td className="border border-white">
                  {getData.PopulationGrowth}
                </td>
              </tr>
              <tr>
                <td className="border border-white">Average 3 bed cost </td>
                <td className="border border-white">{getData.ThreeBedRent}</td>
              </tr>
              <tr>
                <td className="border border-white">Unemployment rate </td>
                <td className="border border-white">{getData.Unemployment}</td>
              </tr>
              <tr>
                <td className="border border-white">Vacancy rate </td>
                <td className="border border-white">{getData.VacancyRate}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table className="table table-dark bg-dark mt-3 border border-white">
            <tbody>
              <tr>
                <th className="border border-white"> {getData.search}</th>
                <th className="border border-white"> {getData.uhOh}</th>
              </tr>
            </tbody>
          </table>
        )
      ) : (
        ""
      )}
    </div>
  );
}
