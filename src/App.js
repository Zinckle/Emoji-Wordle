import "./App.css";
import * as d3 from "d3";
import { useRef, useState } from "react";
import EmojiPicker, {
  EmojiClickData,
  Emoji,
  PreviewConfig,
} from "emoji-picker-react";

export default function App() {
  var list = [];
  /*
  d3.tsv("2021_ranked.tsv", function (data) {
    let code = data.Hex.slice(3);
    code = code.substring(0, code.length - 1);
    data.Hex = code;
    if (!(data.Category === "Flags" || data.Category === "Component")) {
      list.push(data);
    }
  });*/

  //console.log(list);

  /*let options = {
    method: 'GET',
    headers: { 'x-api-key': 'VIyUjX078yMMyLukW85EdA==FrpvQaHWnlOgCXkj' }
  }
  
  //let hex = "😀".codePointAt(0).toString(16)

  let code = '1F642'

  let url = 'https://api.api-ninjas.com/v1/emoji?code=' + code
  
  fetch(url,options)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
          console.log(data)
        })
        .catch(err => {
            console.log(`error ${err}`)
        }); */

  const inputRef = useRef(null);

  const [message, setMessage] = useState("");

  const [updated, setUpdated] = useState("");

  const [selectedEmoji, setSelectedEmoji] = useState("");

  const handleClick = () => {
    // 👇 "inputRef.current.value" is input value
    console.log(selectedEmoji.emoji)
    addItem(selectedEmoji.emoji)
  };


  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // 👇 Get input value
      addItem(selectedEmoji.emoji)
      console.log(selectedEmoji.emoji)

    }
  };

  const onClick = (emojiData, event) => {
    console.log(selectedEmoji.emoji)
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
        <button class = "button-20" onClick={handleClick} onKeyDown={handleKeyDown}>Submit</button>
      </div>
      <div id="parent" class="border"></div>
    </div>
  );
}

function addItem(selectedEmoji) {
      
  // Get type of element from form
  let type = "div";

  // Get the text/value for the tag
  // from the form
  let value = selectedEmoji;

  // createElement() is used for
  // creating a new element
  type
      = document.createElement(type);

  // Use value as textnode in this example
  type.appendChild(
      document.createTextNode(value));

  // Append as child to the parent
  // tag i.e. ol
  document.getElementById(
      "parent").appendChild(
        Object.assign(
          document.createElement('div'),
          { innerHTML: value,
            id: "answer",
            className:"border"
        }
        ));
  }