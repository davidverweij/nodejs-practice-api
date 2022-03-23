/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */

import supertest, { SuperTest, Test } from "supertest";
import app from "../../src/app";
import { Group } from "../../src/models/group";
import User from "../../src/models/user";
import { logger, errorLogger } from "../../src/config/logger";

describe("Auth protected routes", () => {
  let request: SuperTest<Test>;

  logger.transports.forEach((t) => (t.silent = true));
  errorLogger.transports.forEach((t) => (t.silent = true));

  beforeAll(async () => {
    request = supertest(app);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe("should throw 401 when no token is provded", () => {
    it("GET /user/all", async () => {
      const spy = jest.spyOn(User, "findAll");
      const res = await request.get("/user/all");
      expect(res.status).toBe(401);
      expect(spy).not.toBeCalled();
    });
    it("GET /user/suggest", async () => {
      const spy = jest.spyOn(User, "findAll");
      const res = await request.get("/user/suggest");
      expect(res.status).toBe(401);
      expect(spy).not.toBeCalled();
    });
    it("PUT /user/togroup", async () => {
      const spy = jest.spyOn(Group, "findByPk");
      const res = await request.put("/user/togroup");
      expect(res.status).toBe(401);
      expect(spy).not.toBeCalled();
    });
    it("GET /user/:id", async () => {
      const spy = jest.spyOn(User, "findOne");
      const res = await request.get("/user/randomid");
      expect(res.status).toBe(401);
      expect(spy).not.toBeCalled();
    });
    it("POST /user", async () => {
      const spy = jest.spyOn(User, "create");
      const res = await request.post("/user");
      expect(res.status).toBe(401);
      expect(spy).not.toBeCalled();
    });
    it("PUT /user/:id", async () => {
      const spy = jest.spyOn(User, "update");
      const res = await request.put("/user/randomid");
      expect(res.status).toBe(401);
      expect(spy).not.toBeCalled();
    });
    it("DELETE /user/:id", async () => {
      const spy = jest.spyOn(User, "update");
      const res = await request.delete("/user/randomid");
      expect(res.status).toBe(401);
      expect(spy).not.toBeCalled();
    });

    describe("should throw 403 when token is invalid", () => {
      it("GET /user/all", async () => {
        const spy = jest.spyOn(User, "findAll");
        const res = await request
          .get("/user/all")
          .set("x-access-token", "something-invalid");
        expect(res.status).toBe(403);
        expect(spy).not.toBeCalled();
      });
      it("GET /user/suggest", async () => {
        const spy = jest.spyOn(User, "findAll");
        const res = await request
          .get("/user/suggest")
          .set("x-access-token", "something-invalid");
        expect(res.status).toBe(403);
        expect(spy).not.toBeCalled();
      });
      it("PUT /user/togroup", async () => {
        const spy = jest.spyOn(Group, "findByPk");
        const res = await request
          .put("/user/togroup")
          .set("x-access-token", "something-invalid");
        expect(res.status).toBe(403);
        expect(spy).not.toBeCalled();
      });
      it("GET /user/:id", async () => {
        const spy = jest.spyOn(User, "findOne");
        const res = await request
          .get("/user/randomid")
          .set("x-access-token", "something-invalid");
        expect(res.status).toBe(403);
        expect(spy).not.toBeCalled();
      });
      it("POST /user", async () => {
        const spy = jest.spyOn(User, "create");
        const res = await request
          .post("/user")
          .set("x-access-token", "something-invalid");
        expect(res.status).toBe(403);
        expect(spy).not.toBeCalled();
      });
      it("PUT /user/:id", async () => {
        const spy = jest.spyOn(User, "update");
        const res = await request
          .put("/user/randomid")
          .set("x-access-token", "something-invalid");
        expect(res.status).toBe(403);
        expect(spy).not.toBeCalled();
      });
      it("DELETE /user/:id", async () => {
        const spy = jest.spyOn(User, "update");
        const res = await request
          .delete("/user/randomid")
          .set("x-access-token", "something-invalid");
        expect(res.status).toBe(403);
        expect(spy).not.toBeCalled();
      });
    });
  });
});
