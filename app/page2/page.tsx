// Manually creates room with participant limit
"use client";
import { useEffect, useState, useRef } from "react";
import { VideoConference, LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";
import { Track, Room as LiveKitRoomType } from "livekit-client";
import CountdownTimer from "../CountdownTimer";

export default function Page() {
  const [token, setToken] = useState("");
  const [roomDuration, setRoomDuration] = useState(1 * 60 * 1000); // 30
  const maxParticipants = 4; // num of part
  const iD = Math.floor(Math.random() * 100);
  const roomRef = useRef<LiveKitRoomType | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(
          `/api/get-participant-token?room=room&username=${iD}`
        );
        const data = await resp.json();
        setToken(data.token);

        fetch(` 
          /api/create-room?room=room&participantLimit=${maxParticipants}`); // Manually create room with participant limit
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    if (token && roomRef.current) {
      const timer = setTimeout(() => {
        if (roomRef.current) {
          fetch(`
          /api/delete-room?room=room`); // Delete room on timeout
        }
      }, roomDuration);

      return () => clearTimeout(timer);
    }
  }, [token, roomDuration]);

  if (token === "") {
    return <div>Getting token...</div>;
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      style={{ height: "100dvh" }}
    >
      <VideoConference />
      <CountdownTimer duration={roomDuration} />
    </LiveKitRoom>
  );
}
