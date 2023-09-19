export const lookUp = async (inquiry) => {
  const response = await fetch(
    "https://rei-scrape-server.onrender.com/api/scrap" /*"http://localhost:3001/api/scrap"*/,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ search: inquiry }),
    }
  ).catch((err) => {
    console.error(err);
  });

  if (response) {
    if (!response.body) {
      throw new Error("Response body is not available");
    }

    return response.body;
  }
};

export const pingServer = () => {
  return fetch("https://rei-scrape-server.onrender.com/api/scrap");
};

//api live server host
// https://rei-scrape-server.onrender.com
