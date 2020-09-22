import express, { Request, Response } from "express";
import passport from "passport";
import { initDb } from "./util/db";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

initDb(MONGODB_URI, "expense-app")
  .then(() => {
    console.log("Connected successfully to mongodb");
  })
  .catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
  });

// Controllers (route handlers)
// import * as homeController from "./controllers/home";
// import * as userController from "./controllers/user";
// import * as apiController from "./controllers/api";
// import * as contactController from "./controllers/contact";

// API keys and Passport configuration
// import * as passportConfig from "./config/passport";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.json("Server is listening for requests");
});

export default app;
