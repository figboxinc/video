import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useRemoteParticipants } from "@livekit/components-react";
import { useState, useEffect } from "react";

const deleteRoom = () => {
  console.log("deleting room");
  fetch(`/api/delete-room?room=room`);
};

const children = ({ remainingTime }:any) => {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return `${minutes}:${seconds}`;
};

export default function Countdown(props: any) {
  const remoteParticipants = useRemoteParticipants();
  const [shouldStart, setShouldStart] = useState(false);

  useEffect(() => {
    const others = remoteParticipants.length;
    if (others >= 1) {
      setShouldStart(true);
    } else {
      setShouldStart(false);
    }
  }, [remoteParticipants]);

  return (
    <span className="font-bold text-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <CountdownCircleTimer
        size={120}
        trailStrokeWidth={6}
        isPlaying={shouldStart}
        duration={props.duration}
        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
        colorsTime={[7, 5, 2, 0]}
        onComplete={deleteRoom}
      >
        {children}
      </CountdownCircleTimer>
    </span>
  );
}
