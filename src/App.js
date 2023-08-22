import "./App.css";
import * as d3 from "d3";
import { useState, useEffect } from "react";
import EmojiPicker, { Emoji } from "emoji-picker-react";
import Cookies from "js-cookie";
import Countdown from "react-countdown";

import { initializeApp } from "firebase/app";
// eslint-disable-next-line no-unused-vars
import { getAnalytics, logEvent } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAKW5OI9QPbASx8B_Hip2ajIjttF5bVVA",
  authDomain: "emoji-of-the-day-df038.firebaseapp.com",
  projectId: "emoji-of-the-day-df038",
  storageBucket: "emoji-of-the-day-df038.appspot.com",
  messagingSenderId: "988993061012",
  appId: "1:988993061012:web:181c5baf1711a10bdd7481",
  measurementId: "G-Q1GY4TBGM4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);

let clickedEmoji = null;
let answers = "";
let position;
let listOfGuesses = [];
var counter = 0;

export default function App() {
  const [emojiOfTheDay, setEmojiOfTheDay] = useState(null);
  const [listOfPossibleGuesses, setListOfPossibleGuesses] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [listOfPossibleAnswers, setListOfPossibleAnswers] = useState([]);

  useEffect(() => {
    //logEvent(analytics, "game_start");
    //answers = Cookies.get('emojiOfYesterday');
    var date = new Date();

    var seed = cyrb128(
      //remove the date get sec thing to make the randomizer like wordle
      date.getFullYear() + " " + date.getMonth() + " " + date.getDate()
    );
    var rand = sfc32(seed[0], seed[1], seed[2], seed[3]);

    d3.tsv("2021_ranked.tsv")
      .then(function (data) {
        const newListOfPossibleGuesses = [];
        const newListOfPossibleAnswers = [];

        data.forEach((item) => {
          let code = item.Hex.slice(3);
          code = code.substring(0, code.length - 1);
          item.Hex = code;
          newListOfPossibleGuesses.push(item);
          if (!(item.Category === "Flags" || item.Category === "Component")) {
            newListOfPossibleAnswers.push(item);
          }
        });
        setListOfPossibleGuesses(newListOfPossibleGuesses);
        setListOfPossibleAnswers(newListOfPossibleAnswers);

        rand = Math.floor(rand * 1000) % newListOfPossibleAnswers.length;
        setEmojiOfTheDay(newListOfPossibleAnswers[rand]);
      })
      .catch(function (error) {
        console.error("Error loading data:", error);
      });
  }, []);

  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [gameWon, setGameWon] = useState(null);
  useEffect(() => {
    let date = new Date();
    var clickedDate =
      date.getFullYear() + " " + date.getMonth() + " " + date.getDate();
    const foundDate = Cookies.get("foundDate");

    if (emojiOfTheDay !== null && foundDate === clickedDate) {
      var foundListOfGuesses = Cookies.get("listOfGuesses");
      if (foundListOfGuesses !== undefined) {
        foundListOfGuesses = foundListOfGuesses.split(",");
        foundListOfGuesses.forEach((element) => {
          var emo = { unified: element };
          listOfGuesses.push(element);
          setGameWon(submitEmoji(emo, listOfPossibleGuesses, emojiOfTheDay));
          Cookies.set("listOfGuesses", listOfGuesses, { expires: 1 });
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emojiOfTheDay]);
  const handleClick = () => {
    //logEvent(analytics, "test_submit");
    //console.log(selectedEmoji);
    var date = new Date();
    var clickedDate =
      date.getFullYear() + " " + date.getMonth() + " " + date.getDate();
    const foundDate = Cookies.get("foundDate");

    if (foundDate !== clickedDate) {
      Cookies.set("listOfGuesses", "", { expires: 1 });
      listOfGuesses = [];
    }
    Cookies.set("foundDate", clickedDate, { expires: 1 });
    listOfGuesses.push(selectedEmoji.unified);
    setGameWon(
      submitEmoji(selectedEmoji, listOfPossibleGuesses, emojiOfTheDay)
    );
    Cookies.set("listOfGuesses", listOfGuesses, { expires: 1 });
    clickedEmoji = null;
    setSelectedEmoji(null);
  };

  const onClick = (emojiData, event) => {
    clickedEmoji = getEmojiData(emojiData, listOfPossibleGuesses);
    console.log(emojiData);
    setSelectedEmoji(emojiData);

    switch (parseInt(clickedEmoji.Rank) % 10) {
      case 1:
        position = "st";
        break;
      case 2:
        position = "nd";
        break;
      case 3:
        position = "rd";
        break;
      default:
        position = "th";
        break;
    }
  };

  const previewConfig = {
    defaultEmoji: "1f642",
    defaultCaption: "Please Select an Emoji",
    showPreview: false,
  };

  const cat = [
    "suggested",
    "smileys_people",
    "animals_nature",
    "food_drink",
    "travel_places",
    "activities",
    "objects",
    "symbols",
  ];

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  var message
  if (counter > 1) {
    message = `Congratulations! You found the answer ${emojiOfTheDay?.Emoji} in ${counter} guesses!`;
  } else {
    message = `Congratulations! You found the answer ${emojiOfTheDay?.Emoji} in ${counter} guess!`;
  }

  return (
    <div>
      <div class="modal">
        <div class="modal_content">
          <span class="close">&times;</span>
          <div>
            <p class="center congrats">
              {message}
            </p>
            <div class="results center">{answers}</div>
            <div class="button-pad">
              <button
                class="button-28"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      "Emojle.site\n" + answers
                    );
                    console.log("Text copied to clipboard");
                  } catch (error) {
                    console.error("Error copying text to clipboard:", error);
                  }
                }}
              >
                Copy Answers
              </button>
            </div>
            <div class="timer">
              Next game available: <Countdown date={tomorrow} daysInHours="true" />
            </div>
          </div>
        </div>
      </div>

      <div class="center">
        <EmojiPicker
          onEmojiClick={onClick}
          emojiVersion="11.0"
          skinTonesDisabled="true"
          suggestedEmojisMode="recent"
          theme="dark"
          previewConfig={previewConfig}
          emojiStyle="native"
          height={350}
          width={500}
          categories={cat}
        />
      </div>
      {gameWon ? (
        <div></div>
      ) : (
        <div class="center">
          {selectedEmoji ? (
            <span class="clicked-emoji">
              <Emoji
                unified={selectedEmoji.unified}
                size="100"
                emojiStyle="native"
              />
            </span>
          ) : (
            <div class="no-emoji">No Emoji Selected</div>
          )}
          {clickedEmoji != null ? (
            <div class="attribute-container">
              <div class="attributes">Category: {clickedEmoji.Category}</div>
              <div class="attributes">
                Subcategory: {clickedEmoji.Subcategory}
              </div>
              <div class="attributes">
                Popularity: {clickedEmoji.Rank}
                {position}
              </div>
              <div class="attributes">Released: {clickedEmoji.Year}</div>
            </div>
          ) : (
            <div></div>
          )}
          {selectedEmoji ? (
            <div class="button-center">
              <button class="button-20" onClick={handleClick}>
                Submit
              </button>
            </div>
          ) : (
            <span></span>
          )}
        </div>
      )}

      <div class="scrollable">
        <div class="answers">
          <div class="shadow-box">Emoji</div>
          <div class="shadow-box">Category</div>
          <div class="shadow-box">Sub-Category</div>
          <div class="shadow-box">Popularity</div>
          <div class="shadow-box">Released</div>
        </div>
        <div id="parent" class=""></div>
      </div>
    </div>
  );
}
function addItem(selectedEmoji, year, rank, category, subcategory, name) {
  counter = counter + 1;
  switch (parseInt(selectedEmoji.Rank) % 10) {
    case 1:
      position = "st";
      break;
    case 2:
      position = "nd";
      break;
    case 3:
      position = "rd";
      break;
    default:
      position = "th";
      break;
  }

  let value =
    '<div class = "answers"><div class = "shadow-box">' +
    selectedEmoji.Emoji +
    '</div><div class = "spinner shadow-box">' +
    selectedEmoji.Category +
    " " +
    category +
    '</div><div class = "spinner shadow-box">' +
    selectedEmoji.Subcategory +
    " " +
    subcategory +
    '</div><div class = "spinner shadow-box">' +
    selectedEmoji.Rank +
    position +
    " " +
    rank +
    '</div><div class = "spinner shadow-box">' +
    selectedEmoji.Year +
    " " +
    year +
    "</div></div>";

  answers = category + subcategory + rank + year + "\n" + answers;

  document.getElementById("parent").insertBefore(
    Object.assign(document.createElement("div"), {
      innerHTML: value,
      id: "answer",
      className: "",
    }),
    document.getElementById("parent").firstChild
  );
}

function submitEmoji(selectedEmoji, listOfPossibleGuesses, emojiOfTheDay) {
  const search = "-";
  const replaceWith = " ";

  var foundEmoji = getEmojiData(selectedEmoji, listOfPossibleGuesses);
  if (
    emojiOfTheDay.Category === "Smileys & Emotion" ||
    emojiOfTheDay.Category === "People & Body"
  ) {
    emojiOfTheDay.Category = "Smileys & People";
  }

  let year = "✅";
  if (parseInt(foundEmoji.Year) > parseInt(emojiOfTheDay.Year)) {
    year = "⬇️";
  } else if (parseInt(foundEmoji.Year) < parseInt(emojiOfTheDay.Year)) {
    year = "⬆️";
  }

  //check Rank
  let rank = "✅";
  if (parseInt(foundEmoji.Rank) > parseInt(emojiOfTheDay.Rank)) {
    rank = "⬆️";
  }
  if (parseInt(foundEmoji.Rank) < parseInt(emojiOfTheDay.Rank)) {
    rank = "⬇️";
  }

  //check category
  let category = "❌";
  if (foundEmoji.Category === emojiOfTheDay.Category) {
    category = "✅";
  }
  let subcategory = "❌";
  if (foundEmoji.Subcategory === emojiOfTheDay.Subcategory) {
    subcategory = "✅";
  }

  let name = "❌";
  if (
    foundEmoji.Name.charAt(0).toUpperCase() ===
    emojiOfTheDay.Name.charAt(0).toUpperCase()
  ) {
    name = "✅";
  }
  addItem(foundEmoji, year, rank, category, subcategory, name);
  if (
    selectedEmoji.unified
      .split(search)
      .join(replaceWith)
      .replace(/^0+/, "")
      .toUpperCase() === emojiOfTheDay.Hex
  ) {
    var gameWon = true;
    console.log(counter);
    const modal = document.querySelector(".modal");
    const closeBtn = document.querySelector(".close");
    modal.style.display = "block";
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
    return gameWon;
  }
}

function getEmojiData(selectedEmoji, listOfPossibleGuesses) {
  var foundEmoji;
  const search = "-";
  const replaceWith = " ";
  var convertedUni = selectedEmoji.unified
    .split(search)
    .join(replaceWith)
    .replace(/^0+/, "")
    .toUpperCase();

  console.log(convertedUni)
  while (convertedUni !== "") {
    // eslint-disable-next-line no-loop-func
    listOfPossibleGuesses.forEach((element) => {
      if (convertedUni === element.Hex) {
        foundEmoji = element;
        if (
          foundEmoji.Category === "Smileys & Emotion" ||
          foundEmoji.Category === "People & Body"
        ) {
          foundEmoji.Category = "Smileys & People";
        }
      }
    });
    if (foundEmoji === undefined) {
      convertedUni = convertedUni.substr(0, convertedUni.lastIndexOf(" "));
    } else {
      convertedUni = "";
    }
  }
  return foundEmoji;
}

function cyrb128(str) {
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [
    (h1 ^ h2 ^ h3 ^ h4) >>> 0,
    (h2 ^ h1) >>> 0,
    (h3 ^ h1) >>> 0,
    (h4 ^ h1) >>> 0,
  ];
}
function sfc32(a, b, c, d) {
  a >>>= 0;
  b >>>= 0;
  c >>>= 0;
  d >>>= 0;
  var t = (a + b) | 0;
  a = b ^ (b >>> 9);
  b = (c + (c << 3)) | 0;
  c = (c << 21) | (c >>> 11);
  d = (d + 1) | 0;
  t = (t + d) | 0;
  c = (c + t) | 0;
  return (t >>> 0) / 4294967296;
}
