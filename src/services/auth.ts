import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
// import { ValidatedRequest } from "express-joi-validation";
import { InvalidJwtError, MissingJwtError } from "../errors";
// import { TokenRequestSchema } from "../models/authValidation";

const fakeUser = "apiuser";
const fakePassword = "password1";
const superSecret = "this_secret_should_be_hosted_elsewhere";

passport.use(
  new LocalStrategy(
    { session: false },
    (username: string, password: string, done: Function): void => {
      if (username !== fakeUser) return done(null, false);
      if (password !== fakePassword) return done(null, false);

      return done(null, { username: password });
    }
  )
);

class AuthService {
  static getJwt(payload: Object): string {
    const token = jwt.sign(payload, superSecret, { expiresIn: 60 });
    return token;
  }

  // Express middleware to (dis)allow request with JWT tokens
  static checkToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["x-access-token"];

    // NOTE: Joi's validator should provide a ValidatedRequest, but results
    // in typing error. This check (abeit redundant when used with validator)
    // ensures following code can assume token is a string
    if (typeof token !== "string") {
      throw new MissingJwtError("No token provided.");
    }
    return jwt.verify(token, superSecret, (err) => {
      if (err) throw new InvalidJwtError("Failed to authenticate token.");
      next();
    });
  };
}

export { AuthService, passport };
