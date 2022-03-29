import jwt from "jsonwebtoken";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { jwtSecret } from "../../src/config";
import { AuthService } from "../../src/services";
import { InvalidJwtError } from "../../src/errors";
import { validateToken } from "../jestHelpers";

describe("AuthService", () => {
  describe("getJwt should generated expiring tokens", () => {
    it("such as an expired token", async () => {
      const token = AuthService.getJwt({}, -1);

      const valid = validateToken(token);

      expect(valid).toBe(false);
      expect(() => jwt.verify(token, jwtSecret)).toThrow();
    });

    it("such as a valid token", async () => {
      const token = AuthService.getJwt({}, 3600);

      const valid = validateToken(token);

      expect(valid).toBe(true);
      expect(() => jwt.verify(token, jwtSecret)).not.toThrow();
    });
  });

  describe("checkToken", () => {
    it("should throw on missing token", async () => {
      const req = getMockReq();
      const { res, next } = getMockRes();

      expect(() => AuthService.checkToken(req, res, next)).toThrow(
        InvalidJwtError
      );
    });

    it("should throw on invalid token", async () => {
      const token = jwt.sign({}, "secret", { expiresIn: -1 });
      const req = getMockReq({ headers: { "x-access-token": token } });
      const { res, next } = getMockRes();

      expect(() => AuthService.checkToken(req, res, next)).toThrow(
        InvalidJwtError
      );
    });

    it("should proceed with valid token", async () => {
      const token = jwt.sign({}, jwtSecret, { expiresIn: 3600 });
      const req = getMockReq({ headers: { "x-access-token": token } });
      const { res } = getMockRes();
      const spy = jest.fn();

      AuthService.checkToken(req, res, spy);

      expect(spy).toBeCalled();
    });
  });
});
