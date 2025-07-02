import express from "express"
import cors from "cors"
import { createClient } from "redis"
import { redis } from "bun"
import { encodebase62 } from "./services/base62_encoder"

const app = express()
app.use(cors())
app.use(express.json())

//initialize redis
console.log(process.env.REDIS_URL)
const redisclient = createClient({
    url: process.env.REDIS_URL as string,
    
  });
  
  redisclient.on("connect", () => {
    console.log("Redis connected");
  });
  
  redisclient.on("error", (err) => {
    console.error("Redis error:", err);
  });
  
  // Important: connect to



app.post("/shorten",async(req,res) => {
    try {
        const orgrl = req.body.orgrl;
        if(!orgrl) {
            res.json({
                "status" : false,
                "Error" : "Please pass the orignal url"
            })
            return;
        }
        
        const id = await redisclient.incr("global_counter");
        const shortUrlId = encodebase62(id)

        await redisclient.hSet("urls",shortUrlId, orgrl)

        res.json({
            "status" : true,
            "message" : shortUrlId
        })
    }catch(error){
        console.log(error)
        res.json({
            "status ":false,
            "error" : error
        })
    }
})

app.get("/healthcheck",(req,res) => {
    res.json({
        "status" : true,
        "message" : "server is running"
    })
})

app.get("/:shorturlid",async(req,res) => {
    try {
        const shorturlId =  req.params.shorturlid
        console.log(shorturlId)
        if(!shorturlId){
            res.json({
                "status" :false,
                "message" : "short url is required"
            })
            return;
        }
        const originalUrl = await redisclient.hGet("urls",shorturlId);
        if(!originalUrl){
            res.json({
                "status" :false,
                "message" : "url not found"
            })
            return;
        }
        res.redirect(originalUrl)
    } catch(error) {
        console.log(error)
        res.json({
            "status": false,
            "error": error
        })
    }
})

app.listen(3001,async () => {
    try {
        await redisclient.connect();
        console.log("redis working")
        console.log("server is running")
    } catch(error) {
        console.error("Failed to start server:", error)
        process.exit(1)
    }
})