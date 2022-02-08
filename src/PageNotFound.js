/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson9@gmail.com>
 */

import React from "react";
import { Link } from "react-router-dom";
import "./PageNotFound.css";
import { useParams } from "react-router-dom";
import XssDetected from "./XssDetected";

function PageNotFound() {
  const { id } = useParams();
  if (
    //* ======================= Anti XSS och felaktiga URL's =======================
    id.includes(
      "<",
      ">",
      "{",
      "}",
      "/",
      "%",
      "$",
      "[",
      "]",
      "#",
      "@",
      "?",
      "-",
      "'"
    )
  ) {
    return <XssDetected />;
  }
  return (
    <div className="a404-body">
      <h1>
        Oops! <important>404</important>
      </h1>
      <h2>Sidan du letar efter finns inte eller har flyttats!</h2>
      <p>Dubbelkolla att du har skrivit rätt i sökfältet</p>
      <Link className="a404-link" to="/">
        Återvänd till startsidan
      </Link>
    </div>
  );
}

export default PageNotFound;
