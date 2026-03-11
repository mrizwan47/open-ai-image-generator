import { useState, useRef } from "react";

const ASPECT_RATIOS = [
  { label: "Square", value: "1024x1024", icon: "1:1" },
  { label: "Landscape", value: "1536x1024", icon: "3:2" },
  { label: "Portrait", value: "1024x1536", icon: "2:3" },
];

const QUALITY_OPTIONS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const PRICING = {
  low: {
    "1024x1024": 0.005,
    "1024x1536": 0.006,
    "1536x1024": 0.006,
  },
  medium: {
    "1024x1024": 0.011,
    "1024x1536": 0.015,
    "1536x1024": 0.015,
  },
  high: {
    "1024x1024": 0.036,
    "1024x1536": 0.052,
    "1536x1024": 0.052,
  },
};

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [quality, setQuality] = useState("low");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [elapsed, setElapsed] = useState(null);
  const abortRef = useRef(null);

  const generate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setImage(null);
    setElapsed(null);

    const start = Date.now();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), size, quality }),
        signal: controller.signal,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setImage(data.image);
      setElapsed(((Date.now() - start) / 1000).toFixed(1));
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      generate();
    }
  };

  const downloadImage = () => {
    if (!image) return;
    const a = document.createElement("a");
    a.href = image;
    a.download = `generated-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
          AI Image Generator
        </h1>
        <p className="text-[var(--text-muted)] text-sm">
          Powered by GPT Image 1 Mini
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-2xl">
        {/* Prompt */}
        <div className="mb-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the image you want to generate..."
            rows={3}
            className="w-full rounded-xl bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] resize-none transition-all text-sm"
          />
        </div>

        {/* Options Row */}
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Aspect Ratio */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Aspect Ratio
            </label>
            <div className="flex gap-2">
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar.value}
                  onClick={() => setSize(ar.value)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    size === ar.value
                      ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                      : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)]/50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <AspectIcon ratio={ar.value} active={size === ar.value} />
                    <span>{ar.icon}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quality */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Quality
            </label>
            <div className="flex gap-2">
              {QUALITY_OPTIONS.map((q) => (
                <button
                  key={q.value}
                  onClick={() => setQuality(q.value)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    quality === q.value
                      ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                      : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)]/50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span>{q.label}</span>
                    <span className="opacity-60 text-[10px]">
                      ${
                        (PRICING[q.value]?.[size] ??
                          PRICING[q.value]["1024x1024"]).toFixed(3)
                      }
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generate}
          disabled={!prompt.trim() || loading}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Spinner />
              Generating...
            </span>
          ) : (
            "Generate Image"
          )}
        </button>
        <p className="text-[10px] text-[var(--text-muted)] text-center mt-1.5">
          {navigator.platform?.includes("Mac") ? "⌘" : "Ctrl"} + Enter
        </p>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Result */}
        {image && (
          <div className="mt-6">
            <div className="rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
              <img
                src={image}
                alt="Generated"
                className="w-full h-auto block"
              />
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-[var(--text-muted)]">
                Generated in {elapsed}s &middot; {size} &middot; {quality}{" "}
                quality
              </span>
              <button
                onClick={downloadImage}
                className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium cursor-pointer transition-colors"
              >
                Download PNG
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function AspectIcon({ ratio, active }) {
  const color = active ? "#fff" : "#64748b";
  const dims = {
    "1024x1024": { w: 16, h: 16 },
    "1536x1024": { w: 20, h: 14 },
    "1024x1536": { w: 14, h: 20 },
  };
  const { w, h } = dims[ratio] || dims["1024x1024"];
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect
        x={(24 - w) / 2}
        y={(24 - h) / 2}
        width={w}
        height={h}
        rx="2"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
