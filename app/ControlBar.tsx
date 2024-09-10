import { useState } from "react";
import { DisconnectButton, TrackToggle } from "@livekit/components-react";
import { supportsScreenSharing } from '@livekit/components-core';
import {Track} from 'livekit-client'
export default function ControlBar() {
  const browserSupportsScreenSharing = supportsScreenSharing();
  const [isScreenShareEnabled, setIsScreenShareEnabled] = useState(false);
  return (
    
    <div className="flex justify-evenly absolute z-50 bottom-0 left-1/2 -translate-x-1/2 bg-black bg-opacity-30 backdrop-blur-lg  rounded-t-full border-2 border-b-0 p-3 w-1/2">
      <TrackToggle
      source={Track.Source.ScreenShare}
      style={{
        backgroundColor: 'transparent'
      }}
      />
      <DisconnectButton style={{ backgroundColor:"transparent"}}>
        <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
        />
      </svg></DisconnectButton>
    </div>
  );
}
