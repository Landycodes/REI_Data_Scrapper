export const lookUp = async (inquiry) => {
  const response = await fetch(
    "https://rei-scrape-server.onrender.com/api/scrap",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ search: inquiry }),
    }
  );
  if (!response.body) {
    throw new Error("Response body is not available");
  }

  return response.body;
};

export const pingServer = () => {
  return fetch("https://rei-scrape-server.onrender.com/api/scrap");
};

//api live server host
// https://rei-scrape-server.onrender.com
