import { Router } from "express";

import authRouter from "./authRoute";
import docsRouter from "./docsRoute";
import userRouter from "./userRoutes";
import bookRouter from "./bookRoutes";

const appRouter = Router();

// all routes
const appRoutes = [
  {
    path: "/auth",
    router: authRouter,
  },
  {
    path: "/users",
    router: userRouter,
  },
  {
    path: "/books",
    router: bookRouter,
  },
  {
    path: "/docs",
    router: docsRouter,
  },
];

appRoutes.forEach(route => {
  appRouter.use(route.path, route.router);
});

export default appRouter;
