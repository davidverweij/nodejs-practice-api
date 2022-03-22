import { Sequelize } from "sequelize";
import { initModels } from "../../src/data-access";
import User from "../../src/models/user";
import { UserService } from "../../src/services";
// import mockFunction from "../jestHelpers";

describe("UserService", () => {
  let mockSequelize: Sequelize;
  const sampleUserAtt = { login: "login1", password: "pass1", age: 1 };
  const deletedSampleUserAtt = { ...sampleUserAtt, is_deleted: true };
  let sampleUser: User;
  let deletedSampleUser: User;

  beforeAll(async () => {
    // fresh (embedded) DB. Note that we do NOT use PostgreSQL
    // for testing - disallowing any PostgreSQL specific features
    // in the main code base
    mockSequelize = new Sequelize({
      database: "testdatabase",
      dialect: "sqlite",
      username: "root",
      password: "",
      logging: false,
    });
    initModels(mockSequelize);
    await mockSequelize.sync({ force: true });
  });

  beforeEach(async () => {
    // inject sample user
    sampleUser = await User.create(sampleUserAtt);
    deletedSampleUser = await User.create(deletedSampleUserAtt);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await mockSequelize.truncate({ cascade: true }); // clear all inserted models
  });

  afterAll(async () => {
    await mockSequelize.close();
  });

  describe("create", () => {
    it("should return a valid UUID upon creation", async () => {
      const spy = jest.spyOn(User, "create");

      const result = await UserService.create("login", "pass", 1);

      expect(spy).toBeCalled();
      expect(result).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });
  });

  describe("update", () => {
    const userAfter = { login: "login2", password: "pass2", age: 2 };

    it("should update one row in the table", async () => {
      const spy = jest.spyOn(User, "update");

      const status = await UserService.update(
        sampleUser.id,
        userAfter.login,
        userAfter.password,
        userAfter.age
      );
      const result = (await User.findByPk(sampleUser.id)) as User;

      expect(spy).toBeCalled();
      expect(status).toBe(true);
      expect(result).toBeInstanceOf(User);
      expect(result.login).toEqual(userAfter.login);
    });

    it("should not update if user is not found", async () => {
      const wrongUuid = "94f88e92-ea29-4e30-8e7c-1cee928577c8";
      const spy = jest.spyOn(User, "update");

      const status = await UserService.update(
        wrongUuid,
        userAfter.login,
        userAfter.password,
        userAfter.age
      );
      const result = await User.findByPk(wrongUuid);

      expect(spy).toBeCalled();
      expect(status).toBe(false);
      expect(result).toBe(null);
    });

    it("should not update if user is soft-deleted", async () => {
      const spy = jest.spyOn(User, "update");

      const status = await UserService.update(
        deletedSampleUser.id,
        userAfter.login,
        userAfter.password,
        userAfter.age
      );
      const result = (await User.findByPk(deletedSampleUser.id)) as User;

      expect(spy).toBeCalled(); // User.update() is still called, but should not have an effect
      expect(status).toBe(false);
      expect(result.login).not.toBe(userAfter.login);
    });
  });

  describe("autosuggest", () => {
    it("should default to NO limit", async () => {
      const spy = jest.spyOn(User, "findAll");

      await UserService.getAutoSuggest("test");

      expect(spy).toBeCalledWith(expect.objectContaining({ limit: undefined }));
    });
    it("should pass-through any positive limit", async () => {
      const spy = jest.spyOn(User, "findAll");
      const expected = 77;

      await UserService.getAutoSuggest("test", expected);

      expect(spy).toBeCalledWith(expect.objectContaining({ limit: expected }));
    });
    it("should ignore negative limits", async () => {
      const spy = jest.spyOn(User, "findAll");

      await UserService.getAutoSuggest("test", -23);

      expect(spy).toBeCalledWith(expect.objectContaining({ limit: undefined }));
    });
  });

  describe("delete", () => {
    it("should SOFT delete a user", async () => {
      const spyUpdate = jest.spyOn(User, "update");
      const spyDelete = jest.spyOn(User, "destroy");

      const status = await UserService.delete(sampleUser.id);
      const user = (await User.findByPk(sampleUser.id)) as User;

      expect(spyUpdate).toBeCalled();
      expect(spyDelete).not.toBeCalled();
      expect(status).toBe(true);
      expect(user.is_deleted).toEqual(true);
    });

    it("should not act if user is already soft deleted", async () => {
      const spyUpdate = jest.spyOn(User, "update");

      const status = await UserService.delete(deletedSampleUser.id);

      expect(spyUpdate).toBeCalled();
      expect(status).toBe(false);
    });
  });
});
