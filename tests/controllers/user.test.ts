/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */

import supertest, { SuperTest, Test } from "supertest";
import { Sequelize } from "sequelize";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import app from "../../src/app";
import { initModels } from "../../src/data-access";
import { Group, GroupPermissions } from "../../src/models/group";
import User from "../../src/models/user";
import ApiUser from "../../src/models/apiUser";
import { jwtSecret } from "../../src/config";
import { logger, errorLogger } from "../../src/config/logger";

describe("UserController", () => {
  let mockSequelize: Sequelize;
  let request: SuperTest<Test>;

  logger.transports.forEach((t) => (t.silent = true));
  errorLogger.transports.forEach((t) => (t.silent = true));

  const userAtt = {
    id: "769ee62d-7ea6-473f-a289-0547f82fd5e7",
    login: "login1",
    password: "pass1",
    age: 1,
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
  const apiUserAtt = {
    id: "6db9a161-2e0b-498b-86c6-4ef63e5525d0",
    login: "apiuser1",
    password: "1234",
  };
  const apiUserAttSQL = {
    ...apiUserAtt,
    password: bcrypt.hashSync(apiUserAtt.password, bcrypt.genSaltSync(10)),
  };

  beforeAll(async () => {
    mockSequelize = new Sequelize({
      database: "testdatabase",
      dialect: "sqlite",
      username: "root",
      password: "",
      logging: false,
    });
    initModels(mockSequelize);
    request = supertest(app);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe("/all", () => {
    it("should 401 when no token is provded", async () => {
      const spy = jest.spyOn(User, "findAll");

      const res = await request.get("/user/all");

      expect(res.status).toBe(401);
      expect(spy).not.toBeCalled();
    });
    it("should 403 when token is invalid", async () => {
      const spy = jest.spyOn(User, "findAll");

      const res = await request
        .get("/user/all")
        .set("x-access-token", "something-invalid");

      expect(res.status).toBe(403);
      expect(spy).not.toBeCalled();
    });
    it("should return all users", async () => {
      const spy = jest
        .spyOn(User, "findAll")
        .mockImplementation(async () => [new User(userAtt)]);

      const res = await request
        .get("/user/all")
        .set("x-access-token", jwt.sign(apiUserAtt, jwtSecret));

      expect(res.status).toBe(200);
      expect(spy).toBeCalled();
      expect(res.body[0].id).toEqual(userAtt.id);
    });
  });
});
