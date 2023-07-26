import "./App.css";
import * as d3 from "d3";
import { useRef, useState } from "react";
import EmojiPicker, {
  EmojiClickData,
  Emoji,
  PreviewConfig,
} from "emoji-picker-react";

export default function App() {
  var date = new Date()

  var seed = cyrb128(date.getFullYear() + " " + date.getMonth() + " " + date.getDate());
  var rand = sfc32(seed[0], seed[1], seed[2], seed[3]);

  var listOfPossibleGuesses = [];
  var listOfPossibleAnswers = [];

  const data = d3.dsvFormat("\t").parse(d3.dsvFormat("\t").format("2021_ranked.tsv"));
console.log(data)
  d3.tsv("2021_ranked.tsv", function (data) {
    let code = data.Hex.slice(3);
    code = code.substring(0, code.length - 1);
    data.Hex = code;
    listOfPossibleGuesses.push(data);
    if (!(data.Category === "Flags" || data.Category === "Component")) {
      listOfPossibleAnswers.push(data);
    }
  });

  d3.tsv("2021_ranked.tsv")
    .then(function (data) {
      data.forEach((item) => {
        let code = item.Hex.slice(3);
        code = code.substring(0, code.length - 1);
        item.Hex = code;
        listOfPossibleGuesses.push(item);
        if (!(item.Category === "Flags" || item.Category === "Component")) {
          listOfPossibleAnswers.push(item);
        }
      });

      rand = Math.floor(rand * 1000) % listOfPossibleAnswers.length;
      let emojiOfTheDay = listOfPossibleAnswers[rand];
      console.log(emojiOfTheDay);
    })
    .catch(function (error) {
      console.error("Error loading data:", error);
    });

  //rand = Math.floor(rand*10000)
  //let lengthOfAnswers = 1277
  //rand = rand%lengthOfAnswers



  const inputRef = useRef(null);

  const [message, setMessage] = useState("");

  const [updated, setUpdated] = useState("");

  const [selectedEmoji, setSelectedEmoji] = useState("");

  const handleClick = () => {
    // 👇 "inputRef.current.value" is input value
    console.log(selectedEmoji.emoji);
    addItem(selectedEmoji.emoji);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // 👇 Get input value
      addItem(selectedEmoji.emoji);
      console.log(selectedEmoji.emoji);
    }
  };

  const onClick = (emojiData, event) => {
    console.log(selectedEmoji.emoji);
    setSelectedEmoji(emojiData);
  };

  return (
    <div>
      <div class="center">
        <EmojiPicker
          onEmojiClick={onClick}
          emojiVersion="11.0"
          skinTonesDisabled="true"
          suggestedEmojisMode="recent"
          theme="dark"
        />
      </div>

      <div class="center">
        {selectedEmoji ? (
          <span>
            <Emoji
              unified={selectedEmoji.emoji.codePointAt(0).toString(16)}
              size="100"
            />
          </span>
        ) : (
          <span>No emoji Chosen</span>
        )}
        <br />
        <br />
        <button
          class="button-20"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          Submit
        </button>
      </div>
      <div id="parent" class="border"></div>
    </div>
  );
}

function addItem(selectedEmoji) {
  let value = selectedEmoji;

  document
    .getElementById("parent")
    .appendChild(
      Object.assign(document.createElement("div"), {
        innerHTML: value,
        id: "answer",
        className: "border",
      })
    );
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
  };

