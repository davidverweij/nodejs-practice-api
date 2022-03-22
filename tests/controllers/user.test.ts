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

describe("UserController", () => {
  let mockSequelize: Sequelize;
  let request: SuperTest<Test>;

  let user: User;
  let group: Group;
  let apiUser: ApiUser;

  const userAtt = { login: "login1", password: "pass1", age: 1 };
  const groupAtt = {
    name: "admin",
    permissions: [
      GroupPermissions.DELETE,
      GroupPermissions.READ,
      GroupPermissions.WRITE,
    ],
  };
  const apiUserAtt = {
    login: "apiuser1",
    password: "1234",
  };
  const apiUserAttSQL = {
    login: apiUserAtt.login,
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

  beforeEach(async () => {
    user = await User.create(userAtt);
    apiUser = await ApiUser.create(apiUserAttSQL);
    // group = await Group.create(groupAtt);
    // user.addGroup(group);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await mockSequelize.truncate({ cascade: true }); // clear all inserted models
  });

  afterAll(async () => {
    await mockSequelize.close();
  });

  describe("/all", () => {
    it("should 401 when no token is provded", async () => {
      const res = await request.get("/user/all");

      expect(res.status).toBe(401);
    });
    it("should 403 when token is invalid", async () => {
      const res = await request
        .get("/user/all")
        .set("x-access-token", "something-invalid");

      expect(res.status).toBe(403);
    });
    it("should return all users", async () => {
      const res = await request
        .get("/user/all")
        .set("x-access-token", jwt.sign(apiUserAtt, jwtSecret));

      expect(res.status).toBe(200);
    });
  });
});
