from dotenv import load_dotenv
import os
import json

from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import openai, noise_cancellation

load_dotenv()


# Custom Interview Agent
class InterviewAgent(Agent):
    def __init__(self, job_details: str) -> None:
        prompt = f"""
        You are a virtual AI interviewer.

        Conduct an interview for the following job:

        {job_details}

        Ask one question at a time.
        After each answer, ask the next logical question.
        Be friendly, professional, and keep the tone conversational.
        """
        super().__init__(instructions=prompt)


# Entrypoint: runs when agent is assigned to a room
async def entrypoint(ctx: agents.JobContext):
    # 🔁 Step 1: Extract job details (simulate dynamic input here)
    job_details = """
    Job Title: Full Stack Developer
    Skills: React, Node.js, TypeScript, MongoDB
    Experience: 3+ years
    """

    # Check for job details in room participants' metadata
    for participant in ctx.room.remote_participants.values():
        if participant.metadata:
            try:
                data = json.loads(participant.metadata)
                job_details = data.get("jobDetails", job_details)
                break
            except json.JSONDecodeError:
                pass

    # 🔁 Step 2: Create a session with the InterviewAgent
    session = AgentSession(
        llm=openai.realtime.RealtimeModel(voice="coral")
    )

    await session.start(
        room=ctx.room,
        agent=InterviewAgent(job_details=job_details),
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC()
        ),
    )

    await ctx.connect()

    # 🔁 Step 3: Let the agent greet the candidate
    await session.generate_reply(
        instructions="Welcome the candidate and explain the interview process."
    )


# CLI entry point
if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))
