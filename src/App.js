import "./App.css";
import * as d3 from "d3";
import { useState, useEffect } from "react";
import EmojiPicker, { Emoji } from "emoji-picker-react";
//import { generatePalette } from "emoji-palette";
let clickedEmoji = null;
export default function App() {
  
  const [emojiOfTheDay, setEmojiOfTheDay] = useState(null);
  const [listOfPossibleGuesses, setListOfPossibleGuesses] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [listOfPossibleAnswers, setListOfPossibleAnswers] = useState([]);

  useEffect(() => {
    var date = new Date();

    var seed = cyrb128(
      //remove the date get sec thing to make the randomizer like wordle
      date.getFullYear() +
        " " +
        date.getMonth() +
        " " +
        date.getDate() +
        date.getSeconds()
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

        //console.log(newListOfPossibleAnswers[rand]);
      })
      .catch(function (error) {
        console.error("Error loading data:", error);
      });
  }, []);

  const [selectedEmoji, setSelectedEmoji] = useState("");

  const search = "-";
  const replaceWith = " ";

  const handleClick = () => {
    console.log(selectedEmoji)
    if (selectedEmoji == null || selectedEmoji == undefined)
    {
      return
    }

    var foundEmoji = getEmojiData(selectedEmoji, listOfPossibleGuesses);

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
    console.log(clickedEmoji);
    addItem(foundEmoji, year, rank, category, subcategory, name);
    if (
      selectedEmoji.unified
        .split(search)
        .join(replaceWith)
        .replace(/^0+/, "")
        .toUpperCase() === emojiOfTheDay.Hex
    ) {
      const modal = document.querySelector(".modal");
      const closeBtn = document.querySelector(".close");
      modal.style.display = "block";
      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }
    clickedEmoji = null;
    setSelectedEmoji(null);
  };

  const onClick = (emojiData, event) => {
    
    clickedEmoji = getEmojiData(emojiData, listOfPossibleGuesses)
    setSelectedEmoji(emojiData)
    console.log(clickedEmoji)
  };

  const previewConfig = {
    defaultEmoji: "1f642",
    defaultCaption: "Please Select an Emoji",
    showPreview: false,
  };

  return (
    <div>
      <div class="modal">
        <div class="modal_content">
          <span class="close">&times;</span>
          <p>CONGRADULATIONS!!! You did it in {counter} guesses!!!</p>
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
          height={600}
          width={500}
        />
      </div>

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
          <span class="no-emoji">Select an Emoji</span>
        )}
        {clickedEmoji != null ?
        <div class = "">
          <div class = "attributes">Category: {clickedEmoji.Category}</div>
          <div class = "attributes">Subcategory: {clickedEmoji.Subcategory}</div>
          <div class = "attributes">Popularity: {clickedEmoji.Rank}</div>
          <div class = "attributes">Released: {clickedEmoji.Year}</div>
        </div>
        :
        <div></div>
        }
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
var counter = 0;
function addItem(selectedEmoji, year, rank, category, subcategory, name) {
  counter = counter + 1;
  console.log(counter);

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
    " " +
    rank +
    '</div><div class = "spinner shadow-box">' +
    selectedEmoji.Year +
    " " +
    year +
    "</div></div>";

  document.getElementById("parent").insertBefore(
    Object.assign(document.createElement("div"), {
      innerHTML: value,
      id: "answer",
      className: "",
    }),
    document.getElementById("parent").firstChild
  );
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
  while (convertedUni !== "") {
    
    // eslint-disable-next-line no-loop-func
    listOfPossibleGuesses.forEach((element) => {
      if (convertedUni === element.Hex) {
        foundEmoji = element;
      }
    });
    if (foundEmoji === undefined) {
      convertedUni = convertedUni.substr(0, convertedUni.lastIndexOf(" "));
    } else {
      convertedUni = "";
    }
  }
  return foundEmoji

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
