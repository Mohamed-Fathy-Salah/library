import { Router } from "express";

import authRouter from "./authRoute";
import docsRouter from "./docsRoute";
import userRouter from "./userRoutes";
import bookRouter from "./bookRoutes";
import borrowRouter from "./borrowRoutes";

const appRouter = Router();

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
    path: "/borrows",
    router: borrowRouter,
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
