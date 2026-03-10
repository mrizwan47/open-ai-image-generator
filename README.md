# AI Image Generator

A minimal internal tool for generating images using OpenAI's GPT Image 1 Mini model.

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

- **GPT Image 1 Mini** — cheapest image generation model
- **Aspect Ratio** — Square (1:1), Landscape (3:2), Portrait (2:3)
- **Quality** — Low ($0.005), Medium ($0.010), High ($0.019) per image
- **Download** — Save generated images as PNG
- **Keyboard shortcut** — Cmd/Ctrl + Enter to generate
