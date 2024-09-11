// app/ConferenceRoom.tsx
import {
  useRemoteParticipants,
  useParticipants,
  ConnectionStateToast,
  useRoomContext,
  useTracks,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
} from "@livekit/components-react";
import { useEffect, useState, useRef } from "react";
import { Track } from "livekit-client";
import ControlBar from "./ControlBar";
import { useRouter } from "next/navigation";

export default function MyVideoConference(props: any) {
  const remoteParticipants = useRemoteParticipants();
  const allParticipants = useParticipants();
  const maxParticipants = props.participantLimit;
  const room = useRoomContext();
  const participantCountRef = useRef<Set<string>>(new Set());
  const [localID, setLocalID] = useState<string>("null");
  const r = useRouter();

  useEffect(() => { // Participant limit logic. Once limit has been reached, local's id doesnt get added to list.
    const all = allParticipants.length; // Amount of people in room, local and remote
    console.log("all participants", all); // Print amount of people in room to console
    if (all <= maxParticipants) { // If room isnt full
      const localParticipant = allParticipants[0]; // Get local's id
      setLocalID(localParticipant.identity); // Save locals id to variable
      if (!participantCountRef.current.has(localParticipant.identity)) {
        participantCountRef.current.add(localParticipant.identity); // Add id to list if not already there
      }
      console.log("added ", localID, " to list!"); // Log to console that locals id has been added to list
    }
  }, [allParticipants]);

  useEffect(() => { // On disconnect, remove their ID from list
    room.on("participantDisconnected", (participant) => {
      console.log("participant disconnected!!", participant.identity);
      participantCountRef.current.delete(participant.identity);
    });
  }, [remoteParticipants]);

  const participantCount = allParticipants.length; // Amount of people in room, local and remote
  const isLocalInList = localID // Check if local's id is on list
    ? participantCountRef.current.has(localID)
    : false;
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  
  useEffect(() => {
    if (participantCount > maxParticipants && !isLocalInList) {
      // If room is full AND ID is not on list, render full.
      r.push("/full");
    }
  });

  return (
    <>
      <GridLayout tracks={tracks} style={{ height: "calc(100vh)" }}>
        <ParticipantTile />
      </GridLayout>
      <ConnectionStateToast />
      <RoomAudioRenderer />
      <ControlBar />
    </>
  );
}
