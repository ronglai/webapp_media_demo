import { useEffect, useRef, useState } from "react";
import { Toast } from "react-vant";
import { useMediaRecorder } from "./camera";
import { Button, Grid, CountDown, Dialog } from "react-vant";

function Media() {
  const input = useRef(null);
  const output = useRef(null);
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(true);
  const [recording, setRecording] = useState(false);
  const countdownRef = useRef();
  const { startRecording, stopRecording, mediaBlobUrl, stream, option } =
    useMediaRecorder({
      constraints: {
        video: {
          width: {
            ideal: 1280,
            max: 1280,
          },
          height: {
            ideal: 720,
            max: 720,
          },
          facingMode: "user",
          frameRate: { ideal: 30, max: 30 },
        },
        audio: true,
      },
      onStart(stream) {
        console.log("onstart record,stream = ", stream);
        Toast.success("开始录制");
        setStartTime(Date.now());
      },
      onStop(url, blob) {
        console.log("onstop , url = ", url, " blob = ", blob);
        const recvideo = output.current;
        const filename = "temp." + option.type.split("/")[1];
        const temp = new File([blob], filename, option);
        Dialog.alert({
          message: "录制文件大小为" + Math.ceil(temp.size / 1024 / 1024) + "MB",
        });
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
    countdownRef.current.start();
    startRecording();
    setRecording(true);
  }

  function download() {
    // let a = document.createElement("a"); //模拟链接，进行点击下载
    // a.href = mediaBlobUrl;
    // a.style.display = "none"; //不显示
    // a.download = "video.webm";
    // a.click();
  }
  function handleFinish() {
    stopRecording();
    setVisible(false);
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
      {/* <div className="actions">
        <button onClick={() => start()}>开始</button>
      </div> */}
      {visible ? (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            zIndex: 100,
            background: "white",
          }}
        >
          <CountDown
            ref={countdownRef}
            time={60 * 1000}
            autoStart={false}
            onFinish={() => handleFinish()}
          ></CountDown>
          {recording ? null : <Button onClick={() => start()}>开始</Button>}
        </div>
      ) : null}
    </div>
  );
}
export default Media;
