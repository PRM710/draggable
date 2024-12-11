import React, { useState } from "react";
import Draggable from "react-draggable";
import "./App.css";


const App = () => {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [fontStyle, setFontStyle] = useState("normal");
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [addedText, setAddedText] = useState([]);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const handleAddText = () => {
    const newText = {
      id: Date.now(),
      content: text,
      fontSize,
      fontStyle,
      fontWeight,
      fontFamily,
      position: { x: 0, y: 0 },
    };
    const updatedText = [...addedText, newText];
    updateHistory(updatedText);
    setAddedText(updatedText);
    setText("");
  };

  const updateHistory = (newState) => {
    setHistory([...history, addedText]);
    setRedoStack([]);
    setAddedText(newState);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setRedoStack([addedText, ...redoStack]);
      setAddedText(previousState);
      setHistory(history.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setHistory([...history, addedText]);
      setAddedText(nextState);
      setRedoStack(redoStack.slice(1));
    }
  };

  const handleChangeText = (id, field, value) => {
    const updatedText = addedText.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    updateHistory(updatedText);
  };

  return (
    <div>
      <div className="topbar">
        <div className="logo">
        <img src='/celebrare.jpg' width="150" height="100" />
        </div>
        <button onClick={handleUndo} className="button undo-button">
          <img src="/undo.png" alt="Undo" className="button-icon" />
        </button>
        <button onClick={handleRedo} className="button redo-button">
          <img src="/redo.png" alt="Redo" className="button-icon" />
        </button>

      </div>
    <div className="app-container">
      
      <div className="canvas">
        {addedText.map((item) => (
          <Draggable
            key={item.id}
            position={item.position}
            onStop={(e, data) => {
              const updatedText = addedText.map((text) =>
                text.id === item.id
                  ? { ...text, position: { x: data.x, y: data.y } }
                  : text
              );
              updateHistory(updatedText);
            }}
          >
            <div
              className="draggable-item"
              style={{
                fontSize: `${item.fontSize}px`,
                fontStyle: item.fontStyle,
                fontWeight: item.fontWeight,
                fontFamily: item.fontFamily,
              }}
            >
              <input
                type="text"
                value={item.content}
                onChange={(e) =>
                  handleChangeText(item.id, "content", e.target.value)
                }
                className="draggable-input"
                style={{
                  fontSize: `${item.fontSize}px`,
                }}
              />
              <input
                type="number"
                value={item.fontSize}
                onChange={(e) =>
                  handleChangeText(item.id, "fontSize", parseInt(e.target.value, 10))
                }
                className="font-size-input"
              />
            </div>
          </Draggable>
        ))}
      </div>
    </div>
    <div className="botbar">
    <div className="toolbar">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text"
          className="input-text"
        />
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="select-font"
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Verdana">Verdana</option>
        </select>
        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
          placeholder="Font Size"
          className="input-number"
        />
        <button
          onClick={() => setFontStyle(fontStyle === "italic" ? "normal" : "italic")}
          className={`button italic-button ${
            fontStyle === "italic" ? "active" : ""
          }`}
        >
          Italic
        </button>
        <button
          onClick={() => setFontWeight(fontWeight === "bold" ? "normal" : "bold")}
          className={`button bold-button ${fontWeight === "bold" ? "active" : ""}`}
        >
          Bold
        </button>
        <button onClick={handleAddText} className="button add-button">
          Add Text
        </button>

      </div>

</div>
    </div>
  );
};

export default App;
