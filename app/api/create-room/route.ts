import { RoomServiceClient } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get("room");
  const participantLimit = req.nextUrl.searchParams.get("participantLimit");

  if (!room) {
    return NextResponse.json(
      { error: "Missing 'room' param" },
      { status: 400 }
    );
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  const roomService = new RoomServiceClient(wsUrl, apiKey, apiSecret);
  const opts = {
    name: room,
    emptyTimeout: 2 * 60, // room timeout after 2 minutes instead of 10
    maxParticipants: participantLimit ? parseInt(participantLimit) : 4, // num of participants taken from url
  };
  roomService.createRoom(opts).then((room) => {
    // create room and log to console
    console.log("Room successfully created:", room);
  });

  return NextResponse.json("Room Created");
}
