import React, { useEffect, useState } from "react";
import "../style.css";
import { lookUp, pingServer } from "../../utils/API";
import Loading from "../loading";

export default function MainPage() {
  const [getData, setData] = useState(
    localStorage.getItem("tables")
      ? JSON.parse(localStorage.getItem("tables"))
      : []
  );
  const [inputs, setInput] = useState([]);
  const [loading, setLoad] = useState(false);

  //spin up server by making a GET request
  useEffect(() => {
    pingServer();
  }, []);

  //save tables before refresh
  window.addEventListener("beforeunload", function () {
    localStorage.setItem("tables", JSON.stringify(getData));
  });

  //adds response object to usestate hook
  const addObj = (object) => {
    const exists = getData.some((data) => data.Location === object.Location);
    if (!exists) {
      if (object !== undefined) {
        setData((saved) => [...saved, ...object]);
      } else console.log(`Error recieved: ${object}`);
    }
  };

  //Sends an array of strings as a POST request to scrapper API
  const handleQuery = async () => {
    const data = document.querySelector("textarea").value;
    data
      .replace(/[0-9.,-]/g, "")
      .trim()
      .split("\n");
    const splitData = data
      .replace(/[0-9.,-]/g, "")
      .trim()
      .split("\n");

    setInput(splitData);

    if (splitData.length) {
      setLoad(true);
      lookUp(splitData)
        .then((data) => {
          console.log(data);
          addObj(data);
        })
        .finally(() => {
          setLoad(false);
          setInput([]);
          document.querySelector("textarea").value = "";
          console.log(getData);
        });
    }
  };

  const deleteAll = () => {
    setData([]);
    localStorage.clear();
  };

  return (
    <div className="d-flex flex-column align-items-center">
      {loading ? <Loading pages={inputs.length} /> : ""}
      <div className="d-flex flex-column align-items-center">
        <h1 className="mt-4">REI data Scrapper</h1>
        <br />
        <textarea placeholder="Enter City and state" />
        <button
          type="button"
          className={`btn btn-light w-50 mt-3 ${loading ? "disabled" : ""}`}
          onClick={async () => handleQuery()}
        >
          Search
        </button>
        {getData.length ? (
          <div className="mt-4 mb-3 w-100 d-flex justify-content-around">
            <button className="btn btn-secondary">Copy Table</button>
            <button className="btn btn-danger" onClick={() => deleteAll()}>
              Delete Table
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
      {getData.length ? (
        <div className="table-responsive">
          <table className="table table-sm table-dark table-striped table-bordered bg-dark mt-3 border-white">
            <thead className="thead-sm">
              <tr className="shrink p-0 m-0 text-center align-middle">
                <th scope="col">City</th>
                <th scope="col">Population</th>
                <th scope="col">Population Growth</th>
                <th scope="col">Median Income</th>
                <th scope="col">Median Home Price</th>
                <th scope="col">House Value Appreciation</th>
                <th scope="col">3 bed rent cost</th>
                <th scope="col">Vacancy Rate</th>
                <th scope="col">Unemployment Rate</th>
                <th scope="col">Percentage of Renters</th>
              </tr>
            </thead>
            <tbody className="text-nowrap">
              {getData.map((data, index) => {
                return data.Location ? (
                  <tr
                    key={index}
                    data-key={index}
                    className="text-center align-middle"
                  >
                    <td>{data.Location}</td>
                    <td>{data.Population}</td>
                    <td>{data.PopulationGrowth}</td>
                    <td>{data.AverageIncome}</td>
                    <td>{data.MedianHouseValue}</td>
                    <td>{data.MHV_Growth}</td>
                    <td>{data.ThreeBedRent}</td>
                    <td>{data.VacancyRate}</td>
                    <td>{data.Unemployment}</td>
                    <td>{data.PercentOfRenters}</td>
                  </tr>
                ) : (
                  ""
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
