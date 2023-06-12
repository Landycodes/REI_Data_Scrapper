import React, { useEffect, useState } from "react";
import "../style.css";
import { lookUp, pingServer } from "../../utils/API";

export default function Search() {
  const [getData, setData] = useState([]);
  const [inputs, addInput] = useState([]);
  const [loading, setLoad] = useState(false);

  useEffect(() => {
    pingServer();
  }, []);

  const addObj = (object) => {
    const exists = getData.some((data) => data.Location === object.Location);
    if (!exists) {
      setData((saved) => [...saved, object]);
    }
  };

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

  // const testObj = {
  //   Location: "Tucson, Arizona ",
  //   Population: "538,167",
  //   PopulationGrowth: "+2.4% since 2020",
  //   MedianHouseValue: "$37,149",
  //   MHV_Growth: "13.3%",
  //   ThreeBedRent: "$1,700​",
  //   VacancyRate: "3.3%",
  //   PercentOfRenters: "44.4%",
  //   Unemployment: "7.4%",
  // };
  // const testObj2 = {
  //   Location: " new Tucson, Arizona ",
  //   Population: "538,167",
  //   PopulationGrowth: "+2.4% since 2020",
  //   MedianHouseValue: "$37,149",
  //   MHV_Growth: "13.3%",
  //   ThreeBedRent: "$1,700​",
  //   VacancyRate: "3.3%",
  //   PercentOfRenters: "44.4%",
  //   Unemployment: "7.4%",
  // };
  // addObj(testObj);
  // addObj(testObj2);

  return (
    <div className="d-flex flex-column align-items-center">
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
          search.forEach((item) => searchArray.push(item.value));
          console.log(searchArray);
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
            });

          //runs one at a time
          // for (const item of search) {
          //   try {
          //     const data = await lookUp(item.value);
          //     console.log(data);
          //     addObj(data);
          //   } catch (error) {
          //     console.error(error);
          //   }
          // }

          //runs all of them simultaneously
          // search.forEach(async (item) => {
          //   await lookUp(item.value)
          //     .then((data) => {
          //       console.log(data);
          //       addObj(data);
          //     })
          //     .finally(() => {
          //       setLoad(false);
          //       item.value = "";
          //       addInput([]);
          //       const target = document.querySelector(".add");
          //       target.style.display = "block";
          //     });
          // });
        }}
      >
        Search
      </button>

      {getData.length
        ? getData.map((data, index) => {
            return data.Location ? (
              <table
                key={index}
                className="table table-dark bg-dark mt-3 border border-white"
              >
                <tbody className="p-2">
                  <tr className="border border-white">
                    <th>{data.Location}</th>
                  </tr>
                  <tr>
                    <td className="border border-white">House growth value </td>
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
                    <td className="border border-white">Population growth </td>
                    <td className="border border-white">
                      {data.PopulationGrowth}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-white">Average 3 bed cost </td>
                    <td className="border border-white">{data.ThreeBedRent}</td>
                  </tr>
                  <tr>
                    <td className="border border-white">Unemployment rate </td>
                    <td className="border border-white">{data.Unemployment}</td>
                  </tr>
                  <tr>
                    <td className="border border-white">Vacancy rate </td>
                    <td className="border border-white">{data.VacancyRate}</td>
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
  );
}
