import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Poke() {
  const [name, setname] = useState("");
  const [Find, setFind] = useState("scizor");
  const [Img, setImg] = useState("");
  const [Type, setType] = useState("");

  let shiny = true;

  useEffect(() => {
    async function getData() {
      let res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${Find}`);
      console.log(res);

      if (shiny === true) {
        setImg(res.data.sprites.front_shiny);
      } else {
        setImg(res.data.sprites.front_default);
      }
      setType(res.data.types[0].type.name);
    }
    getData();
  }, [Find, shiny]);

  const Typename = (event) => {
    setname(event.target.value);
  };

  const ShinyChange = () => {
    shiny = !shiny;
    console.log(shiny);
    setFind(name.toLowerCase());
  };

  const Search = () => {
    if (name !== "") setFind(name.toLowerCase());
    setname("");
  };

  useEffect(() => {
    const container = document.querySelector(".App");
    const myCanvas = document.getElementById("my-canvas");
    const imgData = document.getElementById("imgData");
    const myContext = myCanvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgData.src;
    img.onload = () => {
      myContext.beginPath();
      myContext.fillStyle = "#FFFFFF";
      myContext.clearRect(0, 0, 100, 100);
      // myContext.globalAlpha = 0;
      myContext.stroke();
      myContext.drawImage(img, 0, 0);
      const imageData = myContext.getImageData(
        0,
        0,
        myCanvas.width,
        myCanvas.height
      );
      const rgbValues = [];
      for (let i = 0; i < imageData.data.length; i += 4) {
        let r = imageData.data[i];
        let r1 = Math.floor(r / 16).toString(16);
        let r2 = ((r / 16 - Math.floor(r / 16)) * 16).toString(16);
        let g = imageData.data[i + 1];
        let g1 = Math.floor(g / 16).toString(16);
        let g2 = ((g / 16 - Math.floor(g / 16)) * 16).toString(16);
        let b = imageData.data[i + 2];
        let b1 = Math.floor(b / 16).toString(16);
        let b2 = ((b / 16 - Math.floor(b / 16)) * 16).toString(16);
        const rgb = "#" + r1 + r2 + g1 + g2 + b1 + b2;
        rgbValues.push(rgb);
      }

      let counts = {};

      for (let i = 0; i < rgbValues.length; i++) {
        if (!(rgbValues[i] in counts)) {
          counts[rgbValues[i]] = 1;
        } else {
          counts[rgbValues[i]] = counts[rgbValues[i]] + 1;
        }
      }

      delete counts["#101010"];
      delete counts["#000000"];

      let colorScheme = Object.entries(counts);
      let sortedScheme = colorScheme.sort((a, b) => a[1] - b[1]).reverse();
      console.log(sortedScheme);
      let bgStr =
        "linear-gradient(to right," +
        sortedScheme[0][0] +
        " 0%," +
        sortedScheme[0][0] +
        " 33%," +
        sortedScheme[1][0] +
        " 33%," +
        sortedScheme[1][0] +
        " 66%," +
        sortedScheme[2][0] +
        " 66%," +
        sortedScheme[2][0] +
        " 100%)";
      container.style.background = bgStr;
    };
  });

  return (
    <div className="back">
      <div className="pokeCard">
        <canvas id="my-canvas" width="100px" height="100px"></canvas>

        <img
          style={{ display: "none" }}
          id="imgData"
          crossOrigin="Anonymous"
          src={`${Img}`}
          alt=""
        />
        <div className="name">{Find.toUpperCase()}</div>

        <div className="type">{Type}</div>

        <input type="text" onChange={Typename} value={name} />

        <button onClick={Search}>Search</button>
        <button onClick={ShinyChange}>Shiny</button>
        <script src="https://unpkg.com/fast-average-color/dist/index.browser.min.js"></script>
      </div>
    </div>
  );
}
