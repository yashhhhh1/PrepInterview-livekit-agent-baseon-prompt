# PrepInterview LiveKit Agent with Dynamic Prompt

A voice-enabled AI interview agent built with LiveKit and OpenAI, featuring dynamic job descriptions and real-time conversations.

## Features

- 🎙️ Real-time voice conversations with AI interviewer
- 🔄 Dynamic job descriptions passed from frontend
- 🎨 Modern Next.js frontend with Tailwind CSS
- 🤖 OpenAI-powered conversational AI
- 🎵 Voice visualizations and audio controls

## Project Structure

```
├── main.py                 # LiveKit agent backend
├── frontend/              # Next.js frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx   # Main application page
│   │   │   └── api/       # API routes
│   │   └── components/    # React components
│   └── package.json
└── README.md
```

## Setup

### Backend (Python Agent)

1. Install dependencies:
```bash
pip install livekit-agents livekit-plugins-openai python-dotenv
```

2. Create a `.env` file with your credentials:
```env
LIVEKIT_URL=your_livekit_url
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
OPENAI_API_KEY=your_openai_key
```

3. Run the agent:
```bash
python main.py
```

### Frontend (Next.js)

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create frontend `.env.local`:
```env
NEXT_PUBLIC_LIVEKIT_SERVER_URL=your_livekit_url
```

4. Run the development server:
```bash
npm run dev
```

## Usage

1. Start the LiveKit agent backend
2. Start the Next.js frontend
3. Open your browser and navigate to the frontend URL
4. Click "Connect to voice agent" to start an AI interview
5. The agent will conduct an interview based on the job description

## Technologies Used

- **Backend**: LiveKit Agents, OpenAI Realtime API, Python
- **Frontend**: Next.js, TypeScript, Tailwind CSS, LiveKit React Components
- **Real-time Communication**: LiveKit WebRTC
- **AI**: OpenAI GPT with voice capabilities

## License

MIT License
