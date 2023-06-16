import React, { useEffect, useState } from "react";
import "../style.css";
import { lookUp, pingServer } from "../../utils/API";
import Loading from "../loading";

export default function Search() {
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

  //adds input elements to useState
  const handleInputs = () => {
    setInput([
      ...inputs,
      <input
        key={inputs.length}
        className="location mb-3 rounded"
        placeholder="Enter city and state"
      />,
    ]);
  };

  //Add five input fields
  const addInputs = () => {
    if (inputs.length <= 3) {
      handleInputs();
    } else {
      const warn = document.createElement("div");
      warn.textContent = "We can only handle 5 searches at a time";
      warn.style.display = "block";
      const target = document.querySelector(".add");
      target.parentNode.insertBefore(warn, target);
      setTimeout(() => {
        warn.style.display = "none";
      }, 3000);
      target.style.display = "none";
    }
    console.log(getData);
  };

  //Sends an array of strings as a POST request to scrapper API
  const handleQuery = async () => {
    const search = document.querySelectorAll(".location");
    const searchArray = [];
    search.forEach((item) => {
      if (item.value !== "") {
        searchArray.push(item.value);
      }
    });
    console.log(searchArray);
    if (searchArray.length) {
      setLoad(true);
      lookUp(searchArray)
        .then((data) => {
          console.log(data);
          addObj(data);
        })
        .finally(() => {
          setLoad(false);
          search.forEach((item) => (item.value = ""));
          setInput([]);
          const target = document.querySelector(".add");
          target.style.display = "block";
          console.log(JSON.stringify(getData));
        });
    }
  };

  //deletes object by its index
  const handleDelete = (index) => {
    setData(getData.filter((item, i) => i !== index));
    localStorage.setItem("tables", JSON.stringify(getData));
  };

  const deleteAll = () => {
    setData([]);
    localStorage.clear();
  };

  //copy single table
  const copyTable = (index) => {
    const table = document.querySelector(`table[data-key="${index}"]`);
    if (!table) return;

    // Extract table data
    const location = table.querySelector("th").textContent;
    const rows = table.querySelectorAll("tbody tr");

    // Format the data
    let copiedText = `${location}\n`;
    rows.forEach((row) => {
      if (!row.classList.contains("ignoreCopy")) {
        const cells = row.querySelectorAll("td");
        const [label, value] = Array.from(cells).map(
          (cell) => cell.textContent
        );
        copiedText += `${label}\t${value}\n`;
      }
    });
    console.log(copiedText);
    // Copy the formatted data to clipboard
    navigator.clipboard.writeText(copiedText);
  };

  return (
    <div className="d-flex flex-column align-items-center">
      {loading ? <Loading /> : ""}
      <h1 className="mt-4">REI data Scrapper</h1>
      <br />
      <input
        className="location mb-3 rounded"
        placeholder="Enter city and state"
      />
      {inputs.map((input) => input)}
      <button
        className="add btn btn-light w-25 mt-2 p-0"
        onClick={() => addInputs()}
      >
        <h4>+</h4>
      </button>
      <button
        type="button"
        className={`btn btn-light w-50 mt-3 ${loading ? "disabled" : ""}`}
        onClick={async () => handleQuery()}
      >
        Search
      </button>
      {getData.length ? (
        <div className="mt-4 mb-3 w-100 d-flex justify-content-around">
          <button className="btn btn-secondary">Copy All</button>
          <button className="btn btn-danger" onClick={() => deleteAll()}>
            Delete All
          </button>
        </div>
      ) : (
        ""
      )}

      <div className="d-flex flex-column-reverse">
        {getData.length
          ? getData.map((data, index) => {
              return data.Location ? (
                <table
                  key={index}
                  data-key={index}
                  className="table table-dark table-striped table-bordered bg-dark mt-3 border border-white"
                >
                  <thead>
                    <tr className="ignoreCopy">
                      <th className="text-center align-middle">
                        {data.Location}
                      </th>
                      <th>
                        <button
                          className="btn btn-secondary btn-sm m-0 float-start"
                          onClick={() => copyTable(index)}
                        >
                          Copy
                        </button>
                        <button
                          className="btn btn-danger btn-sm m-0 float-end"
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="p-2">
                    <tr>
                      <td>House growth value</td>
                      <td className="text-end">{data.MHV_Growth}</td>
                    </tr>
                    <tr>
                      <td>Average Income </td>
                      <td className="text-end">{data.MedianHouseValue}</td>
                    </tr>
                    <tr>
                      <td>Percentage of renters </td>
                      <td className="text-end">{data.PercentOfRenters}</td>
                    </tr>
                    <tr>
                      <td>Population </td>
                      <td className="text-end">{data.Population}</td>
                    </tr>
                    <tr>
                      <td>Population growth </td>
                      <td className="text-end">
                        <span className="invisible">'</span>
                        {data.PopulationGrowth}
                      </td>
                    </tr>
                    <tr>
                      <td>Average 3 bed cost </td>
                      <td className="text-end">{data.ThreeBedRent}</td>
                    </tr>
                    <tr>
                      <td>Unemployment rate </td>
                      <td className="text-end">{data.Unemployment}</td>
                    </tr>
                    <tr>
                      <td>Vacancy rate </td>
                      <td className="text-end">{data.VacancyRate}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <table
                  key={index}
                  className="table table-dark bg-dark mt-3 border border-white"
                >
                  <tbody>
                    <tr>
                      <th className="text-end"> {data.search}</th>
                      <th className="text-end"> {data.uhOh}</th>
                    </tr>
                  </tbody>
                </table>
              );
            })
          : ""}
      </div>
    </div>
  );
}
