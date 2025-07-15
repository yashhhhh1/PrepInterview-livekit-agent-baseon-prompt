"use client";
import { useState, useMemo } from "react";
import {
  LiveKitRoom,
  useVoiceAssistant,
  BarVisualizer,
  RoomAudioRenderer,
  // ConnectionState,
  ConnectionStateToast,
  // useRoomContext,
  ControlBar,
  DisconnectButton,
} from "@livekit/components-react";

import "@livekit/components-styles";

import { MediaDeviceFailure } from "livekit-client";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface RoomDetails {
  roomName: string;
  token: string;
}
export default function Home() {
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [shouldConnect, setShouldConnect] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const userId = useMemo(() => `user-${Math.random().toFixed(5)}`, []);

  const [jobDetails, setJobDetails] = useState(`About the Role:

We’re looking for a Backend Intern who is passionate about technology and eager to work on cutting-edge projects involving AI tools and Node.js. This is an onsite opportunity in Ahmedabad where you’ll be part of a collaborative team focused on building scalable and intelligent backend solutions.
Key Responsibilities:

Assist in designing and developing backend APIs using Node.js
Integrate third-party AI tools and APIs (OpenAI, LangChain, etc.)
Support the team in writing clean, maintainable, and efficient backend code
Troubleshoot, test, and maintain the backend to ensure strong optimization and functionality
Work with databases (e.g., MongoDB, PostgreSQL)
Collaborate closely with frontend developers and product designers
Required Skills:

Strong foundation in JavaScript and Node.js
Basic understanding of AI/ML tools and APIs
Familiarity with RESTful API design
Knowledge of version control (Git)
Strong problem-solving and analytical skills
Good to Have:

Experience with tools like LangChain, Hugging Face, or OpenAI API
Exposure to cloud platforms (AWS, GCP, or Azure)
Understanding of database design and optimization
Who You Are:

Final-year student or recent graduate in Computer Science, Engineering, or a related field
Curious, self-driven, and eager to learn emerging technologies
Available to work onsite in Ahmedabad`);
  const [token, setToken] = useState("");

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // const response = await fetch(`/api/generate-token?UserId=${userId}`);

      // alert(response.status);

      alert(userId)
      const response = await axios.get("/api/generate-token", {
        params: {
          jobDetails,
          username: userId, // customize as needed
        },
      });

      alert(response.status);
      console.log("Response data:", response.data);
      

      // setToken(response.data.token);

      // // const data: any = await response;
      // if (!response) {
      //   setError("Failed to connect to voice agent");
      //   return;
      // }
      setRoomDetails(response.data);
      setShouldConnect(true);
    } catch (error: unknown) {
      console.error("Error connecting to voice agent:", error);
      setError("Failed to connect to voice agent");
      setShouldConnect(false);
    }
  };

  const onDeviceFailure = (e?: MediaDeviceFailure) => {
    console.error("Media device failure:", e);
    setError("Media device failure. Please check your microphone and camera.");
    setShouldConnect(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#9165e913] to-[#988ab319] flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-muted rounded-2xl shadow-xl p-6 w-full max-w-3xl">
          <h1 className="text-2xl font-bold text-primary mb-6 text-center">
            AI Voice Assistant
          </h1>
          <div className="flex flex-col items-center justify-center">
            {!shouldConnect || !roomDetails ? (
              <div className="flex flex-col items-center space-y-4 w-full max-w-sm">
                <p className="text-center text-sm text-muted-foreground">
                  Connect to our AI voice assistant for a conversation
                </p>
                <Button
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  onClick={handleConnect}
                  disabled={isLoading}
                >
                  connect to voice agent
                </Button>
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}
              </div>
            ) : (
              <LiveKitRoom
                data-lk-theme="dark"
                audio={true}
                video={false}
                token={roomDetails.token}
                connect={shouldConnect}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_SERVER_URL}
                onMediaDeviceFailure={onDeviceFailure}
                onDisconnected={() => {
                  setShouldConnect(false);
                  setRoomDetails(null);
                }}
              >
                {/* <ConnectionStatus /> */}
                <VoiceVisualizerWrapper />
                <BarVisualizer />
                <ControlBar />
                <ConnectionStateToast />
                <RoomAudioRenderer />
                <DisconnectButton />
              </LiveKitRoom>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function VoiceVisualizerWrapper() {
  const { state, audioTrack } = useVoiceAssistant();

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <BarVisualizer
        state={state}
        options={{
          maxHeight: 100,
          minHeight: 20,
        }}
        barCount={7}
        trackRef={audioTrack}
        style={
          {
            width: "100%",
            height: "100px",
            "--lk-bar-color": "transparent",
            "--lk-fg-color": "#a3a3a3",
          } as React.CSSProperties
        }
        className="bg-transparent"
      />
      <p className="text-center text-primary text-sm">
        {state === "speaking" ? "Agent is speaking..." : "Listening..."}
      </p>
    </div>
  );
}

// function ConnectionStatus() {
//   // const { connectionState } = useRoomContext();
//   const { connectionState } = useVoiceAssistant();

//   return (
//     <div className="absolute top-4 right-4">
//       <ConnectionState
//         state={connectionState || "disconnected"}
//         style={{ color: "white", fontSize: "14px" }}
//       />
//     </div>
//   );
// }
