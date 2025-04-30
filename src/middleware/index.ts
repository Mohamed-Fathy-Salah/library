import isAdmin from "./isAdmin";
import deserializeUser from "./deserializeUser";
import requireUser from "./requiresUser";
import validateRequest from "./validateRequest";
import rateLimit from "express-rate-limit";

const defaultLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // limit each IP to 15 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: "Too many requests, please try again later.",
  },
});

export {
  deserializeUser,
  requireUser,
  validateRequest,
  isAdmin,
  defaultLimiter,
};
