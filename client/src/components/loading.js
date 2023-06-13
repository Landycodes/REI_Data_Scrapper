import React from "react";

export default function Loading() {
  return (
    <div className="loading w-100 h-100">
      <div style={{ height: "10%" }}></div>
      <h1>Gathering data....</h1>
      <h3>This may take a few minutes</h3>
      <iframe
        title="homer"
        src="https://giphy.com/embed/3y0oCOkdKKRi0"
        width="480"
        height="350"
        frameBorder="0"
        className="disable-hover"
        allowFullScreen
      ></iframe>
      <p>
        <a href="https://giphy.com/gifs/3y0oCOkdKKRi0">via GIPHY</a>
      </p>
    </div>
  );
}
