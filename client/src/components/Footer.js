import React from "react";

export default function Footer() {
  return (
    <div className="d-flex flex-column align-items-center mt-5">
      <p>
        Data for this website is collected from&nbsp;
        <a
          className="text-decoration-none"
          href="https://www.bestplaces.net/"
          target="_blank"
          rel="noreferrer"
        >
          bestplaces.net
        </a>
      </p>
      <p>
        Developed by&nbsp;
        <a
          className="text-decoration-none"
          href="https://github.com/Landycodes"
          target="_blank"
          rel="noreferrer"
        >
          Landycodes
        </a>
      </p>
    </div>
  );
}
