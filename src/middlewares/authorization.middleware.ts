import { NextFunction, Request, Response } from "express";
import { AuthorizationError } from "../shared/errors/authorization-error";
import { UserRole } from "../db/schema/users";
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AuthorizationError("Authentication required.");
      }
      if (!allowedRoles.includes(req.user.role)) {
        throw new AuthorizationError(
          "You do not have permission to perform this action.",
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
