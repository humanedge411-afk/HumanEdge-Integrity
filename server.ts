
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Subscription State (In a real app, this would be in a DB)
  let userSubscription = {
    tier: 'free',
    status: 'active',
    lastUpdated: new Date().toISOString()
  };

  // Mock Admin Settings (In a real app, this would be in a DB)
  let adminSettings = {
    monetization: {
      enabled: true,
      currency: 'USD',
      proPrice: 29,
      elitePrice: 99,
      processor: 'stripe', // 'stripe' | 'paypal' | 'manual'
      stripeKey: '',
      paypalEmail: ''
    }
  };

  // API Routes
  app.get("/api/subscription", (req, res) => {
    res.json(userSubscription);
  });

  app.get("/api/admin/settings", (req, res) => {
    res.json(adminSettings);
  });

  app.post("/api/admin/settings", (req, res) => {
    adminSettings = { ...adminSettings, ...req.body };
    res.json({ success: true, settings: adminSettings });
  });

  app.post("/api/subscription/upgrade", (req, res) => {
    const { tier } = req.body;
    if (['free', 'pro', 'elite'].includes(tier)) {
      userSubscription = {
        tier,
        status: 'active',
        lastUpdated: new Date().toISOString()
      };
      res.json({ success: true, subscription: userSubscription });
    } else {
      res.status(400).json({ error: "Invalid tier" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", engine: "HumanEdge(CA) Neural Core" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HumanEdge(CA) Server running on http://localhost:${PORT}`);
  });
}

startServer();
