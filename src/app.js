import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routers/user.router.js"

const app = express();

app.use(cors
  (
    {
      origin: process.env.CORS_ORIGIN,
      credentials: true
    }
  ))

app.use(express.json());// recieving data from form 
app.use(express.urlencoded({ extended: true }));// recieving data from urls
app.use(express.static("public"));
app.use(cookieParser()); // recieving data from cookies 

app.use("/api/v1/users", userRouter);

// app.get("/user", (req, res) => {
//   res.send("hello user")
// })

///api/v1/users

export { app };