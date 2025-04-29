import { ControllerFunction } from "customDefinition";
import { NextFunction, Request, Response, Router } from "express";

export function catchError(fn: ControllerFunction) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(err => next(err));
  };
}

export const wrapRoutes = (router: Router): void => {
  router.stack.forEach((layer: any) => {
    if (layer.route) {
      layer.route.stack.forEach((routeLayer: any) => {
        const originalHandler = routeLayer.handle;
        routeLayer.handle = catchError(originalHandler);
      });
    } else if (layer.name === "router" && layer.handle.stack) {
      wrapRoutes(layer.handle);
    }
  });
};
