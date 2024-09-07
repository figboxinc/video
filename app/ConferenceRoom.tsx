import { VideoConference } from "@livekit/components-react";
import { useRemoteParticipants } from "@livekit/components-react";

export default function MyVideoConference(props) {
    const participants = useRemoteParticipants(); // Get list of remote participants
    const participantCount = participants.length;
    const maxParticipants = props.participantLimit;
    return (
      <>
        {participantCount >= maxParticipants ? (
          <p className="text-center pt-[30vh] text-3xl p-3">The room is full. Please try again later.</p>
        ) : (
          <VideoConference />
        )}
      </>
    );
  }
  