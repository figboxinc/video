

import React, { useEffect, useState } from 'react';

const CountdownTimer = ({ duration }: { duration: number }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const deleteRoom =() =>  {
    console.log('deleting room')
    fetch(
      `/api/delete-room?room=room`,
    );
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(intervalId);
          deleteRoom();
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [duration]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        backgroundColor: "rgba(0,0,0,0.7)",
        color: "white",
        padding: "5px",
        borderRadius: "5px",
      }}
    >
      {formatTime(timeLeft)}

    </div>
  );
};

export default CountdownTimer;
