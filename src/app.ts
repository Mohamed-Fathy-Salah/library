import express from "express";
import logger from "morgan";
import cors from "cors";
import { deserializeUser } from "./middleware";
import appRouter from "./routes";
import { errorHandler } from "./middleware/error";
import { wrapRoutes } from "./util/handleError";
import helmet from "helmet";

const app = express();

app.use(logger("dev"));
app.set("port", process.env.PORT || 3000);

app.use(cors());
//todo:add caching with invalidation
//todo: add html sanitisation on all string inputs
//todo: add xss
//todo: add csrf
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(deserializeUser);

wrapRoutes(appRouter);
app.use("/api", appRouter);

app.use(errorHandler);
export default app;
