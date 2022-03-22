import { Sequelize } from "sequelize";
import { initModels } from "../../src/data-access";
import { Group, GroupPermissions } from "../../src/models/group";
import { GroupService } from "../../src/services";
// import mockFunction from "../jestHelpers";

describe("GroupService", () => {
  let mockSequelize: Sequelize;
  const adminGroupAtt = {
    name: "admin",
    permissions: [
      GroupPermissions.DELETE,
      GroupPermissions.READ,
      GroupPermissions.WRITE,
    ],
  };
  let adminGroup: Group;

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
    // inject sample Group
    adminGroup = await Group.create(adminGroupAtt);
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
      const spy = jest.spyOn(Group, "create");

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

    it("should update one row in the table", async () => {
      const spy = jest.spyOn(Group, "update");

      const status = await GroupService.update(
        adminGroup.id,
        groupAfter.name,
        groupAfter.permissions
      );
      const result = (await Group.findByPk(adminGroup.id)) as Group;

      expect(spy).toBeCalled();
      expect(status).toBe(true);
      expect(result).toBeInstanceOf(Group);
      expect(result.name).toEqual(groupAfter.name);
    });

    it("should not update if group is not found", async () => {
      const wrongUuid = "94f88e92-ea29-4e30-8e7c-1cee928577c8";
      const spy = jest.spyOn(Group, "update");

      const status = await GroupService.update(
        wrongUuid,
        groupAfter.name,
        groupAfter.permissions
      );
      const result = await Group.findByPk(wrongUuid);

      expect(spy).toBeCalled();
      expect(status).toBe(false);
      expect(result).toBe(null);
    });
  });

  describe("delete", () => {
    it("should HARD delete a Group", async () => {
      const spyUpdate = jest.spyOn(Group, "update");
      // using .prototype as destroy() is called on an instance, not the class
      const spyDelete = jest.spyOn(Group.prototype, "destroy");

      const status = await GroupService.delete(adminGroup.id);
      const group = await Group.findByPk(adminGroup.id);

      expect(spyUpdate).not.toBeCalled();
      expect(spyDelete).toBeCalled();
      expect(status).toBe(true);
      expect(group).toEqual(null);
    });
  });
});
