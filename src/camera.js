import { useCallback, useEffect, useRef, useState } from "react";

export function useMediaRecorder(options) {
  const { constraints, onStart = () => {}, onStop = () => {} } = options;

  const mediaRecorder = useRef(null);
  const mediaChunks = useRef([]);
  const mediaStream = useRef(null);
  const [status, setStatus] = useState("idle");
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
  const [error, setError] = useState("NONE");
  const [option, setOption] = useState(() => {
    const back = ["video/mp4", "video/webm"];
    for (let i of back) {
      if (MediaRecorder.isTypeSupported(i)) {
        console.log("可以兼容格式", i);
        return { type: i };
      }
    }
    return null;
  });

  useEffect(() => {
    async function init() {
      setStatus("acquiring_media");
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );
        mediaStream.current = audioStream;
        setStatus("idle");
      } catch (error) {
        setError(error.name);
        setStatus("idle");
        alert(error);
        console.log(error);
      }
    }
    init();
    console.log("get useMedia,set stream");
  }, []);

  function startRecording() {
    setError("NONE");
    if (mediaStream.current) {
      console.log("start recording");
      if (!option) {
        alert("此浏览器没有兼容的格式，请换个浏览器尝试");
        throw Error("此浏览器没有兼容的视频格式，请换一个浏览器");
      }
      mediaRecorder.current = new MediaRecorder(mediaStream.current, option);
      mediaRecorder.current.ondataavailable = onRecordingActive;
      mediaRecorder.current.onstart = () => {
        onStart(mediaStream.current);
      };
      mediaRecorder.current.onstop = onRecordingStop;
      mediaRecorder.current.onerror = () => {
        setError("NO_RECORDER");
        setStatus("idle");
      };
      mediaRecorder.current.start();
      setStatus("recording");
    } else {
      console.error("mediastream 为null ");
    }
  }

  function onRecordingActive(e) {
    if (e && e.data && e.data.size > 0) {
      mediaChunks.current.push(e.data);
    }
  }

  function onRecordingStop() {
    console.log("on record stop");
    const blob = new Blob(mediaChunks.current, option);
    const url = URL.createObjectURL(blob);
    setStatus("stopped");
    setMediaBlobUrl(url);
    onStop(url, blob);
  }

  // const pauseRecording = () => {
  //   if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
  //     mediaRecorder.current.pause();
  //   }
  // };
  // const resumeRecording = () => {
  //   if (mediaRecorder.current && mediaRecorder.current.state === "paused") {
  //     mediaRecorder.current.resume();
  //   }
  // };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      if (mediaRecorder.current.state !== "inactive") {
        console.log("stop");
        setStatus("stopping");
        mediaRecorder.current.stop();
        mediaStream.current &&
          mediaStream.current.getTracks().forEach((track) => track.stop());
        mediaChunks.current = [];
      }
    }
  };

  return {
    error,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    status,
    stream: mediaStream.current,
    option,
  };
}
