import express from "express";
import cors from "cors";
import { createClient } from "redis";
import { encodebase62 } from "./services/encodebase62.js";
import rateLimit from "express-rate-limit";

const app = express();
console.log(process.env.NODE_ENV);
app.use(cors((process.env.NODE_ENV == "production") ? {
  origin: "https://bimalxshorten.vercel.app",
  credentials: true
} : {
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, //limit to 100 requests per 15 minutes
  message: "Too many requests, please try again later."
});
app.use(limiter);

// Initialize Redis
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
console.log("Connecting to Redis:", REDIS_URL);

const redisclient = createClient({
    url: REDIS_URL,
});

redisclient.on("connect", () => {
    console.log("Redis connected");
});

redisclient.on("error", (err) => {
    console.error("Redis error:", err);
});

app.post("/shorten", async (req, res) => {
    try {
        let orgrl = req.body.orgrl?.trim();
        if (!orgrl) {
             res.status(400).json({
                status: false,
                error: "Please pass the original URL"
            });
            return
        }

        // Ensure URL has a protocol (default to http:// if missing)
        if (!orgrl.match(/^https?:\/\//i)) {
            orgrl = 'http://' + orgrl;
        }

        const id = await redisclient.incr("global_counter");
        const shortUrlId = encodebase62(id);

        await redisclient.hSet("urls", shortUrlId, orgrl);

         res.json({
            status: true,
            message: shortUrlId
        });
        return
    } catch (error) {
        console.error("Error in /shorten:", error);
         res.status(500).json({
            status: false,
            error: "Internal server error"
        });
        return
    }
});

app.get("/healthcheck", (req, res) => {
     res.json({
        status: true,
        message: "server is running"
    });
    return
});

app.get("/:shorturlid", async (req, res) => {
    try {
        const shorturlId = req.params.shorturlid;
        console.log("Looking up:", shorturlId);

        if (!shorturlId) {
             res.status(400).json({
                status: false,
                message: "Short URL is required"
            });
            return
        }

        const originalUrl = await redisclient.hGet("urls", shorturlId);
        if (!originalUrl) {
             res.status(404).json({
                status: false,
                message: "URL not found"
            });
            return
                    }

        console.log("Redirecting to:", originalUrl);

        // If URL doesn't start with http:// or https://, prepend http://
        let redirectUrl = originalUrl;
        if (!originalUrl.match(/^https?:\/\//i)) {
            redirectUrl = 'http://' + originalUrl;
        }

         res.redirect(301, redirectUrl);
        return
    } catch (error) {
        console.error("Error in redirect:", error);
         res.status(500).json({
            status: false,
            error: "Internal server error"
        });
        return
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
    try {
        await redisclient.connect();
        console.log("Redis connected successfully");
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
});