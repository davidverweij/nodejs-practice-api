import { Sequelize } from "sequelize";
import { initModels } from "../../src/data-access";
import User from "../../src/models/user";
import { UserService } from "../../src/services";

describe("UserService", () => {
  let mockSequelize: Sequelize;
  const sampleUserAtt = {
    id: "769ee62d-7ea6-473f-a289-0547f82fd5e7",
    login: "login1",
    password: "pass1",
    age: 1,
  };

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
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should return an UUID upon creation", async () => {
      const spy = jest
        .spyOn(User, "create")
        .mockImplementation(() => new User(sampleUserAtt));

      const result = await UserService.create("login", "pass", 1);

      expect(spy).toBeCalled();
      expect(result).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });
  });

  describe("update", () => {
    const userAfter = { login: "login2", password: "pass2", age: 2 };

    it("should return true when successful update", async () => {
      const spy = jest
        .spyOn(User, "update")
        .mockImplementation(() => Promise.resolve([1]));

      const status = await UserService.update(
        sampleUserAtt.id,
        userAfter.login,
        userAfter.password,
        userAfter.age
      );

      expect(spy).toBeCalled();
      expect(status).toBe(true);
    });

    it("should return false if user does not exists", async () => {
      const wrongUuid = "94f88e92-ea29-4e30-8e7c-1cee928577c8";
      const spy = jest
        .spyOn(User, "update")
        .mockImplementation(() => Promise.resolve([0]));

      const status = await UserService.update(
        wrongUuid,
        userAfter.login,
        userAfter.password,
        userAfter.age
      );

      expect(spy).toBeCalled();
      expect(status).toBe(false);
    });

    it("should not act if user is already soft deleted", async () => {
      const spyUpdate = jest
        .spyOn(User, "update")
        .mockImplementation(() => Promise.resolve([0]));

      const status = await UserService.update(
        sampleUserAtt.id,
        userAfter.login,
        userAfter.password,
        userAfter.age
      );

      expect(spyUpdate).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          where: expect.objectContaining({
            is_deleted: false,
          }),
        })
      );
      expect(status).toBe(false);
    });
  });

  describe("autosuggest", () => {
    it("should default to NO limit", async () => {
      const spy = jest
        .spyOn(User, "findAll")
        .mockImplementation(async () => [new User(sampleUserAtt)]);

      await UserService.getAutoSuggest("test");

      expect(spy).toBeCalledWith(expect.objectContaining({ limit: undefined }));
    });
    it("should pass-through any positive limit", async () => {
      const spy = jest
        .spyOn(User, "findAll")
        .mockImplementation(async () => [new User(sampleUserAtt)]);
      const expected = 77;

      await UserService.getAutoSuggest("test", expected);

      expect(spy).toBeCalledWith(expect.objectContaining({ limit: expected }));
    });
    it("should ignore negative limits", async () => {
      const spy = jest
        .spyOn(User, "findAll")
        .mockImplementation(async () => [new User(sampleUserAtt)]);

      await UserService.getAutoSuggest("test", -23);

      expect(spy).toBeCalledWith(expect.objectContaining({ limit: undefined }));
    });

    it("should ignore users that are soft deleted", async () => {
      const spy = jest
        .spyOn(User, "findAll")
        .mockImplementation(async () => []);

      await UserService.getAutoSuggest("test");

      expect(spy).toBeCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            is_deleted: false,
          }),
        })
      );
    });
  });

  describe("delete", () => {
    it("should SOFT delete a user", async () => {
      const spyUpdate = jest
        .spyOn(User, "update")
        .mockImplementation(() => Promise.resolve([1]));
      const spyDelete = jest.spyOn(User, "destroy");

      const status = await UserService.delete(sampleUserAtt.id);

      expect(spyUpdate).toBeCalled();
      expect(spyDelete).not.toBeCalled();
      expect(status).toBe(true);
    });

    it("should not act if user is already soft deleted", async () => {
      const spyUpdate = jest
        .spyOn(User, "update")
        .mockImplementation(() => Promise.resolve([0]));

      const status = await UserService.delete(sampleUserAtt.id);

      expect(spyUpdate).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          where: expect.objectContaining({
            is_deleted: false,
          }),
        })
      );
      expect(status).toBe(false);
    });
  });
});
