# AI Image Generator (OpenAI GPT Image 1 Mini Demo)

An open-source internal tool built with React, Vite, and an Express proxy that shows how to generate production-ready images via the OpenAI Images API (GPT Image 1 Mini). This project doubles as a reference implementation for teams that want a lightweight prompt playground, marketing image studio, or rapid concept art generator running on localhost.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and add your OpenAI API key:
   ```bash
   cp .env.example .env
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173`

## Features

- **GPT Image 1 Mini integration** — Uses the most affordable OpenAI image model for quick iterations and demos
- **Customizable aspect ratios** — Square (1:1), Landscape (3:2), Portrait (2:3) layouts for ads, social content, and presentation decks
- **Dynamic pricing calculator** — Automatically displays per-image cost (low / medium / high quality) as you switch resolutions
- **Express proxy** — Securely routes requests through a Node.js backend so your OpenAI API key never touches the browser
- **Download-ready outputs** — Save generated PNGs directly from the gallery
- **Productivity shortcut** — Cmd/Ctrl + Enter to trigger fast prompt runs

## Tech stack

- **Frontend:** React 19, Vite 6, Tailwind CSS utility classes
- **Backend:** Node.js 24, Express 4, CORS, dotenv
- **AI SDK:** Official `openai` JavaScript client with `images.generate`
- **Tooling:** Concurrent dev servers, modern ES modules, environment variable support

### Pricing reference (per image)

| Quality | 1024×1024 | 1024×1536 | 1536×1024 |
|---------|-----------|-----------|-----------|
| Low     | $0.005    | $0.006    | $0.006    |
| Medium  | $0.011    | $0.015    | $0.015    |
| High    | $0.036    | $0.052    | $0.052    |

## Demo

Prompt used for the preview:

> A futuristic botanical conservatory atrium at sunrise, glass walls glowing with soft golden light reflecting off lush bioluminescent plants, suspended walkways lined with brushed brass railings, a central koi pond with gentle mist, hyperreal cinematic lighting, ultra-detailed textures

![App screenshot](./screenshot.png)

## Use cases

- Internal creative tooling for marketing or product teams
- Rapid prototyping of hero images, mood boards, and UI concept art
- Demonstrating OpenAI image generation in hackathons or workshops
- Teaching prompt engineering fundamentals with a ready-to-run example

## Roadmap ideas

- Add prompt templates and negative prompt support
- Generate multiple variations per request
- Include recent OpenAI image quality presets and style presets
- Support deployments to platforms like Vercel, Render, or Railway

Got suggestions? Open an issue or fork the repo—this project is designed to be a discoverable, SEO-friendly starting point for anyone exploring OpenAI-powered image generation apps.
