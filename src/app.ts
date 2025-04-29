import express from "express";
import logger from "morgan";
import cors from "cors";
import { deserializeUser } from "./middleware";
import appRouter from "./routes";
import { errorHandler } from "./middleware/error";
import { wrapRoutes } from "./util/handleError";

const app = express();

app.use(logger("dev"));
app.set("port", process.env.PORT || 3000);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(deserializeUser);

wrapRoutes(appRouter);
app.use("/api", appRouter);

app.use(errorHandler);
export default app;
