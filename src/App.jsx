import { useEffect, useRef, useState } from "react";
import { useMediaRecorder } from "./camera";
import "./App.css";

function App() {
  const input = useRef(null);
  const output = useRef(null);
  const [show, setShow] = useState(false);
  const { startRecording, stopRecording, mediaBlobUrl, stream } =
    useMediaRecorder({
      constraints: {
        video: true,
        audio: true,
      },
      onStart(stream) {
        console.log("onstart record,stream = ", stream);
      },
      onStop(url, blob) {
        console.log("onstop , url = ", url, " blob = ", blob);
        const recvideo = output.current;
        setShow(true);
        recvideo.src = url;
        recvideo.controls = true;
        recvideo.play();
      },
    });

  useEffect(() => {
    if (stream) {
      input.current.srcObject = stream;
      input.current.play();
    }
  }, [stream]);

  function start() {
    startRecording();
  }

  function play() {
    stopRecording();
  }
  function download() {
    // let a = document.createElement("a"); //模拟链接，进行点击下载
    // a.href = mediaBlobUrl;
    // a.style.display = "none"; //不显示
    // a.download = "video.webm";
    // a.click();
  }
  return (
    <div className="App">
      <div className="container">
        <video
          ref={input}
          muted="muted"
          className={`recorder ${show ? "hide" : ""}`}
          playsInline
          webkit-playsinline="true"
        ></video>
        <video
          ref={output}
          className={`showVideo ${!show ? "hide" : ""}`}
        ></video>
      </div>
      <div className="actions">
        <button onClick={() => start()}>开始</button>
        <button onClick={() => play()}>播放</button>
        <button onClick={() => download()}>下载</button>
      </div>
    </div>
  );
}

export default App;
