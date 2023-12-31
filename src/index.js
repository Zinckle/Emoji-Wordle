import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

// Specify all properties: name, family, style

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div>

    <h1>Emojle</h1>

    <App />
    <div class="center">
      <footer class="site-footer c">
        <div class="container">
          <div class="row">
            <div class="col-sm-12 col-md-6">
              <h6>About</h6>
              <p class="text-justify">
                Emojle is an emoji-based guessing game similar to Wordle, the objective
                is to guess the correct emoji based on feedback on previous
                guesses. Start by selecting any emoji and use the information
                you get from that guess to try and find the emoji of the day!
              </p>
            </div>
          </div>
        </div>
        <div class="container">
          <div class="row">
            <div class="col-md-8 col-sm-6 col-xs-12">
              <p class="copyright-text">
                Copyright &copy; 2023 All Rights Reserved by Mitchell Zinck
              </p>
            </div>

            <div class="col-md-4 col-sm-6 col-xs-12">
              <ul class="social-icons">
                <a
                  class="btn btn-outline-light btn-social mx-1"
                  href="https://github.com/zinckle"
                >
                  <FontAwesomeIcon icon={faGithub} />
                </a>
                <a
                  class="btn btn-outline-light btn-social mx-1"
                  href="https://www.linkedin.com/in/mitchellzinck/"
                >
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
                <a
                  class="btn btn-outline-light btn-social mx-1"
                  href="https://zinck.xyz"
                >
                  <FontAwesomeIcon icon={faGlobe} />
                </a>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
