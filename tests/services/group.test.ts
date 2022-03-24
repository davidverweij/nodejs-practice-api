import { Sequelize } from "sequelize";
import { initModels } from "../../src/data-access";
import { Group, GroupPermissions } from "../../src/models/group";
import { GroupService } from "../../src/services";

describe("GroupService", () => {
  let mockSequelize: Sequelize;
  const adminGroupAtt = {
    id: "c2a8995b-9b10-440b-9755-335949d0631f",
    name: "admin",
    permissions: [
      GroupPermissions.DELETE,
      GroupPermissions.READ,
      GroupPermissions.WRITE,
    ],
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should return an UUID upon creation", async () => {
      const spy = jest
        .spyOn(Group, "create")
        .mockImplementation(() => Promise.resolve(new Group(adminGroupAtt)));

      const result = await GroupService.create("newGroup", []);

      expect(spy).toBeCalled();
      expect(result).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });
  });

  describe("update", () => {
    const groupAfter = {
      name: "subAdminGroup",
      permissions: [GroupPermissions.READ, GroupPermissions.WRITE],
    };

    it("should return true when successful update", async () => {
      const spy = jest
        .spyOn(Group, "update")
        .mockImplementation(() => Promise.resolve([1]));

      const status = await GroupService.update(
        adminGroupAtt.id,
        groupAfter.name,
        groupAfter.permissions
      );

      expect(spy).toBeCalled();
      expect(status).toBe(true);
    });

    it("should return false if group does not exists", async () => {
      const wrongUuid = "94f88e92-ea29-4e30-8e7c-1cee928577c8";
      const spy = jest
        .spyOn(Group, "update")
        .mockImplementation(() => Promise.resolve([0]));

      const status = await GroupService.update(
        wrongUuid,
        groupAfter.name,
        groupAfter.permissions
      );

      expect(spy).toBeCalled();
      expect(status).toBe(false);
    });
  });

  describe("delete", () => {
    it("should HARD delete a Group", async () => {
      const spyUpdate = jest.spyOn(Group, "update");
      const spyFind = jest
        .spyOn(Group, "findByPk")
        .mockImplementation(() => Promise.resolve(new Group(adminGroupAtt)));
      // using .prototype as destroy() is called on an instance, not the class
      const spyDelete = jest
        .spyOn(Group.prototype, "destroy")
        .mockImplementation(() => Promise.resolve());

      const status = await GroupService.delete(adminGroupAtt.id);

      expect(spyUpdate).not.toBeCalled();
      expect(spyFind).toBeCalled();
      expect(spyDelete).toBeCalled();
      expect(status).toBe(true);
    });
  });
});
