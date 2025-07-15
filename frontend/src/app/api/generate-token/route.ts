import { error } from "console";
import { AccessToken, RoomServiceClient } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

const livekitHost = process.env.LIVEKIT_URL;
const livekitSecret = process.env.LIVEKIT_API_SECRET;
const livekitApiKey = process.env.LIVEKIT_API_KEY;

type Grant = {
    room: string;
    roomJoin: boolean;
    canPublish: boolean;
    canSubscribe: boolean;
    canPublishData: boolean;
    canUpdateOwnMetadata: boolean;
};

const createAccessToken = async (userInfo: { identity: string; name?: string, jobDetails: string }, grant: Grant) => {
    const accesstoken = new AccessToken(livekitApiKey, livekitSecret, userInfo);
    accesstoken.addGrant(grant);
    return await accesstoken.toJwt();
}

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const jobDetails = url.searchParams.get("jobDetails");
        const username = url.searchParams.get("username");

        console.log("Received data:", { jobDetails, username });

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }
        const roomName = uuid();

        // return NextResponse.json({ message: "Data received successfully", jobDetails, username });

        if (!livekitApiKey || !livekitHost || !livekitSecret) {
            throw error("livekit error api host secret not work")
        }
        const roomClient = new RoomServiceClient(livekitHost, livekitApiKey, livekitSecret);

        await roomClient.createRoom({
            name: roomName,
        });
        const grant = {
            room: roomName,
            roomJoin: true,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true,
            canUpdateOwnMetadata: true,
        };

        const token = await createAccessToken({
            identity: username,
            name: username,
            jobDetails: jobDetails ?? ""
        }, grant);

        // if (!userId) {
        //     return NextResponse.json({ error: "UserId is required" }, { status: 400 });
        // }


        return NextResponse.json({ roomName, token }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
    }
}