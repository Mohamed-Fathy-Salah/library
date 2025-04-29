import { Router } from "express";

import authRouter from "./authRoute";
import docsRouter from "./docsRoute";
import userRouter from "./userRoutes";
import router from "./bookRoutes";
import borrowRouter from "./borrowRoutes";
import reportsRouter from "./reportRoutes";

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
    router: router,
  },
  {
    path: "/borrows",
    router: borrowRouter,
  },
  {
    path: "/reports",
    router: reportsRouter,
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
