export const lookUp = (inquiry) => {
  return fetch("https://rei-scrape-server.onrender.com/api/scrap", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ search: inquiry }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => console.error(err));
};

export const pingServer = () => {
  return fetch("https://rei-scrape-server.onrender.com/api/scrap");
};
