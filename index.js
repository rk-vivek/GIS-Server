require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const path    = require("path");

const solveRouter = require("./routes/solve");

const app  = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
    "https://gis-client-vercel.vercel.app/",
    "http://localhost:5173", 
    
    process.env.FRONTEND_URL?.replace(/\/$/, "")
].filter(Boolean);
// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));
app.use(express.json());

// ── API Routes ──────────────────────────────────────────────────────────────
app.use("/api", solveRouter);

// ── Serve React build in production ─────────────────────────────────────────
if (process.env.NODE_ENV === "production") {
  const clientBuild = path.join(__dirname, "..", "client", "dist");
  app.use(express.static(clientBuild));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuild, "index.html"));
  });
}

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 IssueSolver server running on http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/solve`);
  if (process.env.NODE_ENV !== "production") {
    console.log(`   Start React dev server: cd client && npm run dev`);
  }
});
