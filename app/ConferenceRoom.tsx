// app/ConferenceRoom.tsx
import { useRemoteParticipants,
  useParticipants,
  ConnectionStateToast,
  useRoomContext,
  useTracks,
  GridLayout, 
  ParticipantTile,
  VideoConference,
  ParticipantName,
  ParticipantLoop, 
  RoomAudioRenderer
  } from "@livekit/components-react";
import { useEffect, useState, useRef } from "react";
import {Track} from 'livekit-client';
import ControlBar from "./ControlBar";
import { useRouter } from "next/navigation";
import { Room } from "livekit-server-sdk";

export default function MyVideoConference(props: any) {
  const remoteParticipants = useRemoteParticipants();
  const allParticipants = useParticipants();
  const maxParticipants = props.participantLimit;
  const room = useRoomContext();
  const participantCountRef = useRef<Set<string>>(new Set());
  const [localID, setLocalID] = useState<string>('null');
  const r = useRouter();
 
  useEffect(() => { // Once room is full, 
    const all = allParticipants.length; // Everyone in room
    console.log("all participants", all);
    if (all <= maxParticipants) { // If everyone in room is less than limit
    const localParticipant = allParticipants[0]; // Get local's id
    setLocalID(localParticipant.identity); 
    if(!participantCountRef.current.has(localParticipant.identity))
      {
    participantCountRef.current.add(localParticipant.identity); // Add id to list if not already there
    }
    console.log('added ',localID,' to list!')
    }
  }, [allParticipants]);

  useEffect(() => { // On disconnect, remove their ID from list
    room.on("participantDisconnected", (participant) => {
      console.log("participant disconnected!!", participant.identity);
      participantCountRef.current.delete(participant.identity);
    });
  }, [remoteParticipants]);

  const participantCount = allParticipants.length;
  const isLocalInList = localID ? participantCountRef.current.has(localID) : false;
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  room.localParticipant // Send remaining time to server
  useEffect(() => {
    if (participantCount > maxParticipants && !isLocalInList) // If room is full AND ID is on list, render full.
    {
      r.push('/full');
    }
  })


  return (
    <>
      
        <GridLayout tracks={tracks} style={{ height: 'calc(100vh)' }}>
      
      <ParticipantTile/>
      
    </GridLayout>
    <ConnectionStateToast />
    <RoomAudioRenderer />
    <ControlBar/>
    
        </>
      
    
  );
}

