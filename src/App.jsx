import React, { useRef, useMemo, useState } from "react";
import Comment from "./Comment";
import "./styles.scss";

export default function App() {
  return (
    <div className="app">
      <Comment />
      {/* <Avatar src="https://joeschmoe.io/api/v1/random" /> */}

      {/* <MyReactQuill /> */}
    </div>
  );
}
