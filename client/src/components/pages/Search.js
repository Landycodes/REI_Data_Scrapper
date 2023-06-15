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
  const [inputs, addInput] = useState([]);
  const [loading, setLoad] = useState(false);

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

  //expands array of input elements
  const handleInputs = () => {
    addInput([
      ...inputs,
      <input
        key={inputs.length}
        className="location mb-3"
        placeholder="Enter city and state"
      />,
    ]);
  };

  //deletes object by its index
  const handleDelete = (index) => {
    setData(getData.filter((item, i) => i !== index));
    localStorage.setItem("tables", JSON.stringify(getData));
  };

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
      <input className="location mb-3" placeholder="Enter city and state" />
      {inputs.map((input) => input)}
      <button
        className="add btn btn-light w-25 mt-2 p-0"
        onClick={() => {
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
        }}
      >
        <h4>+</h4>
      </button>
      <button
        type="button"
        className={`btn btn-light w-50 mt-3 ${loading ? "disabled" : ""}`}
        onClick={async () => {
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
                addInput([]);
                const target = document.querySelector(".add");
                target.style.display = "block";
                console.log(JSON.stringify(getData));
              });
          }
        }}
      >
        Search
      </button>

      <div className="d-flex flex-column-reverse">
        {getData.length
          ? getData.map((data, index) => {
              return data.Location ? (
                <table
                  key={index}
                  data-key={index}
                  className="table table-dark bg-dark mt-3 border border-white"
                >
                  <tbody className="p-2">
                    <tr className="border border-white ignoreCopy">
                      <th>{data.Location}</th>
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
                    <tr>
                      <td className="border border-white">
                        House growth value
                      </td>
                      <td className="border border-white">{data.MHV_Growth}</td>
                    </tr>
                    <tr>
                      <td className="border border-white">House value </td>
                      <td className="border border-white">
                        {data.MedianHouseValue}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-white">
                        Percentage of renters{" "}
                      </td>
                      <td className="border border-white">
                        {data.PercentOfRenters}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-white">Population </td>
                      <td className="border border-white">{data.Population}</td>
                    </tr>
                    <tr>
                      <td className="border border-white">
                        Population growth{" "}
                      </td>
                      <td className="border border-white">
                        <span className="invisible">'</span>
                        {data.PopulationGrowth}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-white">
                        Average 3 bed cost{" "}
                      </td>
                      <td className="border border-white right-align">
                        {data.ThreeBedRent}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-white">
                        Unemployment rate{" "}
                      </td>
                      <td className="border border-white">
                        {data.Unemployment}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-white">Vacancy rate </td>
                      <td className="border border-white">
                        {data.VacancyRate}
                      </td>
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
                      <th className="border border-white"> {data.search}</th>
                      <th className="border border-white"> {data.uhOh}</th>
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
