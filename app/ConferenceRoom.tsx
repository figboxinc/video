// app/ConferenceRoom.tsx
import { VideoConference } from "@livekit/components-react";
import { useRemoteParticipants, useParticipants, useDataChannel, useRoomContext, useTracks, GridLayout, ParticipantTile } from "@livekit/components-react";
import { addParticipant, getParticipantCount, removeParticipant } from "./utils/roomParticipants";
import { useEffect, useState } from "react";
import {Track} from 'livekit-client';
import ControlBar from "./ControlBar";

export default function MyVideoConference(props: any) {
  const remoteParticipants = useRemoteParticipants();
  const allParticipants = useParticipants();
  const maxParticipants = props.participantLimit;
  const [currentParticipantCount, setCurrentParticipantCount] = useState(0);
  const dataChan = useDataChannel();
  const room = useRoomContext();
  const [localID, setLocalID] = useState<string | null>(null);

  useEffect(() => {
    const all = allParticipants.length;
    console.log("all participants", all);
    if (all < maxParticipants) {
    const localParticipant = allParticipants.find((p) => p.isLocal);
    setLocalID(localParticipant?.identity || null);
    if(!getParticipantCount().includes(localParticipant?.identity || ''))
      {
    addParticipant(localParticipant?.identity || "");
    }
    console.log('added ',localID,' to list!')
    }
  }, [allParticipants]);

  useEffect(() => {
    room.on("participantDisconnected", (participant) => {
      console.log("participant disconnected!!", participant.identity);
      removeParticipant(participant.identity);
    });
  }, [remoteParticipants]);

  const participantCount = allParticipants.length;
  const isLocalInList = localID ? getParticipantCount().includes(localID) : false;
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  

  return (
    <>
      {participantCount >= maxParticipants && !isLocalInList ? (
        <p className="text-center pt-[30vh] text-3xl p-3">The room is full. Please try again later.</p>
      ) : (<>
        <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      
      <ParticipantTile />
    </GridLayout>
    <ControlBar/>
        </>
      )}
    </>
  );
}
