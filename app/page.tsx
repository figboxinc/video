// Uses useRemoteParticipants hook to count participants and decide what to render
"use client";
import { useEffect, useState, useRef } from "react";
import {
  LiveKitRoom,
} from "@livekit/components-react";
import "@livekit/components-styles";
import CountdownTimer from "./CountdownTimer";
import ConferenceRoom from "./ConferenceRoom";

export default function Page() {
  const [token, setToken] = useState("");
  const [roomDuration, setRoomDuration] = useState(.5 * 60 * 1000); // 30
  const [maxParticipants, setMaxParticipants] = useState(3); // Max number of participants allowed
  const roomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Fetch token and automatically create room
    (async () => {
      try {
        const iD = Math.floor(Math.random() * 100);
        const resp = await fetch(
          `/api/get-participant-token?room=room&username=${iD}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  {/*useEffect(() => {
    // Delete the room once timer has run out
    if (token && roomRef.current) {
      const timer = setTimeout(() => {
        if (roomRef.current) {
          fetch(`
          /api/delete-room?room=room`);
        }
      }, roomDuration);

      return () => clearTimeout(timer);
    }
  }, [token, roomDuration]);*/}

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
      ref={roomRef}
    >
      <ConferenceRoom participantLimit={maxParticipants} />
      <CountdownTimer duration={roomDuration} />
    </LiveKitRoom>
  );
}
