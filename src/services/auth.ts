import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
// import { ValidatedRequest } from "express-joi-validation";
import { InvalidJwtError } from "../errors";
// import { TokenRequestSchema } from "../models/authValidation";
import ApiUser from "../models/apiUser";
import { jwtSecret, jwtLifespan } from "../config";

passport.use(
  new LocalStrategy(
    async (
      username: string,
      password: string,
      done: Function
    ): Promise<void> => {
      const apiUser = await ApiUser.findOne({ where: { login: username } });

      if (!apiUser) return done(null, false);

      const validPassword = await bcrypt.compare(password, apiUser.password);
      if (!validPassword) return done(null, false);

      return done(null, true);
    }
  )
);

class AuthService {
  static getJwt(payload: Object, lifespan: number = jwtLifespan): string {
    const token = jwt.sign(payload, jwtSecret, { expiresIn: lifespan });
    return token;
  }

  // Express middleware to (dis)allow request with JWT tokens
  static checkToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["x-access-token"] as string;

    return jwt.verify(token, jwtSecret, (err) => {
      if (err) throw new InvalidJwtError("Failed to authenticate token.");
      next();
    });
  };

  // static method to generate hash (not implemented in API - yet)
  static genHash = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
  };
}

export { AuthService, passport };
