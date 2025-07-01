import express from "express"
import cors from "cors"
import { createClient } from "redis"
import { redis } from "bun"
import { encodebase62 } from "./services/base62_encoder"

const app = express()
app.use(cors())
app.use(express.json())

//initialize redis

const redisclient = createClient({
    url: "redis://default:dyHQJuPfvQ8jMyIUQIQQPWKiJOkme9cS@redis-14716.c15.us-east-1-4.ec2.redns.redis-cloud.com:14716"
  });
  
  redisclient.on("connect", () => {
    console.log("Redis connected");
  });
  
  redisclient.on("error", (err) => {
    console.error("Redis error:", err);
  });
  
  // Important: connect to



app.post("/shorten",async(req,res) => {
    const orgrl = req.body.orgrl;
    if(!orgrl) {
        res.json({
            "status" : false,
            "Error" : "Please pass the orignal url"
        })
        return;
    }
    try{
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

app.get("/:shorturlid",async(req,res) => {
    const shorturlId =  req.params.shorturlid
    console.log(shorturlId)
    if(!shorturlId){
        res.json({
            "status" :false
        })
        return;
    }
    const originalUrl = await redisclient.hGet("urls",shorturlId);
    res.json({
        "status" : true,
        "data" : originalUrl
    })
})

app.listen(3001,async () => {
    await redisclient.connect();
    console.log("redis working")
    console.log("server is running")
})