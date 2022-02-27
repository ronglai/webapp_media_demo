import { useEffect, useState, useRef, useCallback } from "react";
import { Dialog, Uploader } from "react-vant";
import Webcam from "react-webcam";
import style from "./cameraSim.module.css";

function WebcamCapture(props) {
  const { setValue, setShowCapture } = props;
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [height, setHeight] = useState(100);
  const [width, setWidth] = useState(100);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    setValue([{ url: imageSrc, isImage: true }]);
    setShowCapture(false);
  }, [webcamRef, setImgSrc, setValue, setShowCapture]);

  async function getCameraSize() {
    let video = document.getElementById("camera_simulate");
    let track = video.srcObject.getTracks()[0];
    if (track.getSettings) {
      let { width, height } = track.getSettings();
      console.log(`${width}x${height}`);
      setHeight(height);
      setWidth(width);
      return;
    }
    await new Promise((resolve) => (video.onloadedmetadata = resolve));
    console.log(`${video.videoWidth}x${video.videoHeight}`);
    setHeight(height);
    setWidth(width);
  }

  function handleMediaError() {
    Dialog.alert({
      message: "get user media failed",
    });
  }

  return (
    <>
      <div className={style.cameraLayout}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          onUserMedia={getCameraSize}
          onUserMediaError={handleMediaError}
          id="camera_simulate"
          height={height}
          width={width}
        />
        <div className={style.cameraRest}>
          <button
            onClick={capture}
            type="submit"
            className={style.cameraButton}
          ></button>
        </div>
      </div>
    </>
  );
}
function Camera() {
  const [check, setCheck] = useState(() => {
    var el = document.createElement("input");
    return el.capture != undefined;
  });
  const [showCapture, setShowCapture] = useState(false);
  const [value, setValue] = useState([]);

  // useEffect(() => {
  //   if (check) {
  //     return;
  //   }
  //   // Dialog.alert({ message: "not support capture",
  //   // });
  // }, []);
  function takePhoto(event) {
    if (check) {
      console.log("youyong");
      return;
    }
    console.log("wuyong");
    event.preventDefault();
    setShowCapture(true);
  }
  return (
    <>
      <Uploader
        value={value}
        onClickUpload={takePhoto}
        onChange={(v) => setValue(v)}
      ></Uploader>
      {!check && showCapture ? (
        <WebcamCapture setValue={setValue} setShowCapture={setShowCapture} />
      ) : null}
    </>
  );
}

export default Camera;
