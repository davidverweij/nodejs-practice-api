/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */

import supertest, { SuperTest, Test } from "supertest";
import { Sequelize, Transaction } from "sequelize";
import app from "../../src/app";
import { initModels } from "../../src/data-access";
import { Group, GroupPermissions } from "../../src/models/group";
import User from "../../src/models/user";
import { logger, errorLogger } from "../../src/config";

describe("UserController", () => {
  let mockSequelize: Sequelize;
  let request: SuperTest<Test>;
  const validJwtToken: string =
    " eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFwaXVzZXIxIiwicGFzc3dvcmQiOiIxMjM0IiwiaWF0IjoxNjQ4NDg0MjQwfQ.b48921LLr3ebVJfLRmuy7nyqgBs1YhXpXGKoz75Xl_g";

  logger.transports.forEach((t) => (t.silent = true));
  errorLogger.transports.forEach((t) => (t.silent = true));

  const userAtt = {
    id: "769ee62d-7ea6-473f-a289-0547f82fd5e7",
    login: "login1",
    password: "password",
    age: 5,
  };
  const groupAtt = {
    id: "c2a8995b-9b10-440b-9755-335949d0631f",
    name: "admin",
    permissions: [
      GroupPermissions.DELETE,
      GroupPermissions.READ,
      GroupPermissions.WRITE,
    ],
  };
  const assignGroupPayload = {
    groupId: "c2a8995b-9b10-440b-9755-335949d0631f",
    userIds: [
      "769ee62d-7ea6-473f-a289-0547f82fd5e7",
      "83bf149c-2532-46ad-90ac-bfac9c27de9f",
    ],
  };

  beforeAll(async () => {
    mockSequelize = new Sequelize({
      database: "testdatabase",
      dialect: "postgres",
      username: "root",
      password: "",
      logging: false,
    });
    initModels(mockSequelize);
    request = supertest(app);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /all", () => {
    it("should return all users", async () => {
      const spy = jest
        .spyOn(User, "findAll")
        .mockImplementation(() => Promise.resolve([new User(userAtt)]));

      const res = await request
        .get("/user/all")
        .set("x-access-token", validJwtToken);

      expect(res.status).toBe(200);
      expect(spy).toBeCalled();
      expect(res.body[0].id).toEqual(userAtt.id);
    });
  });

  describe("GET /suggest", () => {
    it("should require a 'filter' param", async () => {
      const res = await request
        .get("/user/suggest")
        .set("x-access-token", validJwtToken);

      expect(res.status).toBe(400);
    });

    it("should NOT require a limit", async () => {
      const spy = jest
        .spyOn(User, "findAll")
        .mockImplementation(() => Promise.resolve([new User(userAtt)]));

      const res = await request
        .get("/user/all")
        .set("x-access-token", validJwtToken)
        .query({ filter: "login" });

      expect(res.status).toBe(200);
      expect(spy).toBeCalled();
      expect(res.body[0].id).toEqual(userAtt.id);
    });

    it("should work with any limit", async () => {
      const spy = jest
        .spyOn(User, "findAll")
        .mockImplementation(() => Promise.resolve([new User(userAtt)]));

      const res = await request
        .get("/user/all")
        .set("x-access-token", validJwtToken)
        .query({ filter: "login", limit: -99 });

      expect(res.status).toBe(200);
      expect(spy).toBeCalled();
      expect(res.body[0].id).toEqual(userAtt.id);
    });

    it("should return (an empty array) despite no filter matches", async () => {
      const spy = jest
        .spyOn(User, "findAll")
        .mockImplementation(() => Promise.resolve([]));

      const res = await request
        .get("/user/all")
        .set("x-access-token", validJwtToken)
        .query({ filter: "noMatches" });

      expect(res.status).toBe(200);
      expect(spy).toBeCalled();
      expect(res.body).toEqual([]);
    });
  });

  describe("PUT /togroup", () => {
    it("should fail when group not found", async () => {
      const spy = jest
        .spyOn(Group, "findByPk")
        .mockImplementation(() => Promise.resolve(null));

      const res = await request
        .put("/user/togroup")
        .set("x-access-token", validJwtToken)
        .send(assignGroupPayload);

      expect(res.status).toBe(404);
      expect(spy).toBeCalled();
    });

    it("should fail AND rollback when ANY of users not found", async () => {
      const spy = jest
        .spyOn(Group, "findByPk")
        .mockImplementation(() => Promise.resolve(new Group(groupAtt)));
      const spyAddGroup = jest
        .spyOn(User.prototype, "addGroup")
        .mockImplementation(() => Promise.resolve());
      const spyUser = jest
        .spyOn(User, "findByPk")
        .mockImplementationOnce(() => Promise.resolve(new User(userAtt)))
        .mockImplementationOnce(() => Promise.resolve(null));
      const spyTransactionRollback = jest
        .spyOn(Transaction.prototype, "rollback")
        .mockImplementation(() => Promise.resolve());
      const spyTransactionCommit = jest.spyOn(Transaction.prototype, "commit");

      const res = await request
        .put("/user/togroup")
        .set("x-access-token", validJwtToken)
        .send(assignGroupPayload);

      expect(res.status).toBe(404);
      expect(spy).toBeCalledTimes(1);
      expect(spyUser).toBeCalledTimes(2);
      expect(spyAddGroup).toBeCalledTimes(1);
      expect(spyTransactionRollback).toBeCalledTimes(1);
      expect(spyTransactionCommit).not.toBeCalled();
    });
  });

  describe("GET /:id", () => {
    it("should return the found user", async () => {
      const spy = jest
        .spyOn(User, "findOne")
        .mockImplementation(() => Promise.resolve(new User(userAtt)));

      const res = await request
        .get(`/user/${userAtt.id}`)
        .set("x-access-token", validJwtToken);

      expect(res.status).toBe(200);
      expect(spy).toBeCalled();
      expect(res.body.id).toEqual(userAtt.id);
    });

    it("should fail on formatting", async () => {
      const spy = jest
        .spyOn(User, "findOne")
        .mockImplementation(() => Promise.resolve(new User(userAtt)));

      const res = await request
        .get(`/user/${userAtt.id}1345`) // notice the additional chars
        .set("x-access-token", validJwtToken);

      expect(res.status).toBe(400);
      expect(spy).not.toBeCalled();
    });

    it("should 404 on not found", async () => {
      jest
        .spyOn(User, "findOne")
        .mockImplementation(() => Promise.resolve(null));

      const res = await request
        .get(`/user/${userAtt.id}`)
        .set("x-access-token", validJwtToken);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    it("should return the created user id", async () => {
      const spy = jest
        .spyOn(User, "create")
        .mockImplementation(() => Promise.resolve(new User(userAtt)));
      const { id, ...userPayload } = userAtt;

      const res = await request
        .post("/user")
        .set("x-access-token", validJwtToken)
        .send(userPayload);

      expect(res.status).toBe(201);
      expect(spy).toBeCalled();
      expect(res.body.id).toEqual(userAtt.id);
    });
  });

  describe("PUT /:id", () => {
    it("should return 204", async () => {
      const spy = jest
        .spyOn(User, "update")
        .mockImplementation(() => Promise.resolve([1]));
      const { id, ...userPayload } = userAtt;

      const res = await request
        .put(`/user/${userAtt.id}`)
        .set("x-access-token", validJwtToken)
        .send(userPayload);

      expect(res.status).toBe(204);
      expect(spy).toBeCalled();
    });

    it("should 404 on not found", async () => {
      jest.spyOn(User, "update").mockImplementation(() => Promise.resolve([0]));
      const { id, ...userPayload } = userAtt;

      const res = await request
        .put(`/user/${userAtt.id}`)
        .set("x-access-token", validJwtToken)
        .send(userPayload);

      expect(res.status).toBe(404);
    });
  });
});
