import React, { useEffect, useState } from "react";
import "../style.css";
import { lookUp, pingServer } from "../../utils/API";
import Loading from "../loading";
import Footer from "../Footer";

export default function MainPage() {
  const [getData, setData] = useState(
    localStorage.getItem("tables")
      ? JSON.parse(localStorage.getItem("tables"))
      : []
  );
  const [inputs, setInput] = useState([]);
  const [loading, setLoad] = useState(false);
  const [pageLoaded, setPages] = useState(0);

  //spin up server by making a GET request
  useEffect(() => {
    pingServer();
  }, []);

  useEffect(() => {
    if (loading) {
      document.body.style.overflowY = "hidden";
    } else if (!loading) {
      document.body.style.overflowY = "auto";
    }
  }, [loading]);

  //save tables before refresh
  window.addEventListener("beforeunload", function () {
    localStorage.setItem("tables", JSON.stringify(getData));
  });

  //adds response object to usestate hook
  const addObj = (object) => {
    if (!object) {
      return;
    }
    const exists = getData.some((data) => data.Location === object.Location);
    if (!exists) {
      if (object !== undefined) {
        setData((saved) => [...saved, ...object]);
      } else console.log(`Error recieved: ${object}`);
    }
  };

  //takes API response and handles pages loaded and final data object
  const processData = async (body) => {
    if (!body) {
      console.log("failed to get data");
      window.alert("Something has gone terribly wrong 😢");
      return;
    }
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let result = "";
    let dataArray = [];

    // Function to process each line of data
    const processDataLine = (line) => {
      const data = JSON.parse(line);
      if (data.page) {
        // console.log(`Scanning page ${data.page}`);
        setPages(data.page);
      }
      if (Array.isArray(data)) {
        // console.log("It's an array!");
        dataArray.push(...data);
      }
    };

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        if (result.length > 0) {
          processDataLine(result);
        }
        break;
      }

      result += decoder.decode(value);
      const lines = result.split("\n");

      for (let i = 0; i < lines.length - 1; i++) {
        processDataLine(lines[i]);
      }
      result = lines[lines.length - 1];
    }
    return dataArray; // Return the final result
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
      // console.log(splitData);
      lookUp(splitData)
        .then(processData)
        .then((data) => {
          // console.log(data);
          addObj(data);
        })
        .finally(() => {
          setLoad(false);
          setInput([]);
          setPages(0);
          document.querySelector("textarea").value = "";
          // console.log(getData);
        });
    }
  };

  const deleteAll = () => {
    setData([]);
    localStorage.clear();
  };

  //deletes object by its index
  const deleteOne = (index) => {
    setData(getData.filter((item, i) => i !== index));
    localStorage.setItem("tables", JSON.stringify(getData));
  };

  const copyAll = () => {
    const range = document.createRange();
    range.selectNode(document.querySelector("table"));

    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    // Copy the selected content to the clipboard
    document.execCommand("copy");

    // Clear the selection
    window.getSelection().removeAllRanges();
    window.alert("Table Copied!");
  };

  return (
    <div className="d-flex flex-column align-items-center">
      {loading ? <Loading pageLoaded={pageLoaded} pages={inputs.length} /> : ""}
      <div className="d-flex flex-column align-items-center">
        <h2 className="mt-4 mb-0">REI data Scrapper</h2>
        <p className="text-info mb-0">Enter city and state below</p>
        <p className="text-info mb-0">
          Important! Seperate each city with a new line
        </p>
        <br />
        <textarea
          className="bg-dark text-light rounded"
          placeholder={`Example: \n Tucson AZ \n Dallas TX`}
        />
        <button
          type="button"
          className={`btn btn-light w-50 mt-3 ${loading ? "disabled" : ""}`}
          onClick={async () => handleQuery()}
        >
          Search
        </button>
        {getData.length ? (
          <div className="mt-4 mb-3 w-100 d-flex justify-content-around">
            <button className="btn btn-secondary" onClick={() => copyAll()}>
              Copy Table
            </button>
            <button className="btn btn-danger" onClick={() => deleteAll()}>
              Delete Table
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
      {getData.length ? (
        <div className="table-container">
          <table className="table table-sm table-dark table-striped table-bordered bg-dark mt-3 border-secondary">
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
                    <td>"{data.PopulationGrowth}"</td>
                    <td>{data.AverageIncome}</td>
                    <td>{data.MedianHouseValue}</td>
                    <td>{data.MHV_Growth}</td>
                    <td>{data.ThreeBedRent}</td>
                    <td>{data.VacancyRate}</td>
                    <td>{data.Unemployment}</td>
                    <td>{data.PercentOfRenters}</td>
                  </tr>
                ) : (
                  <tr key={index}>
                    <td colSpan={"6"}>
                      <b>{data.Error}</b> No results found 😔 Check spelling,
                      remove 'city' if applicable. Delete me, Retype and try
                      again
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm m-0 float-end"
                        onClick={() => deleteOne(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}
      {!loading ? <Footer /> : ""}
    </div>
  );
}
