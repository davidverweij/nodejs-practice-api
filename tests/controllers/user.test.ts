import { getMockReq, getMockRes } from "@jest-mock/express";
import { StatusCodes } from "http-status-codes";
import { UserController } from "../../src/controllers";
import User from "../../src/models/user";
import { UserService } from "../../src/services";
import mockFunction from "../jestHelpers";

// Mock Dependencies
jest.mock("../../src/services");

describe("UserController.all", () => {
  describe("should return an undefined list of users", () => {
    it("when there are users in the DB", async () => {
      // Create casted User object
      const users = [
        {
          id: "123",
          login: "login1",
          password: "password1",
          age: 1,
        },
      ] as User[];
      const mockedGetAll = mockFunction(UserService.getAll);
      mockedGetAll.mockResolvedValue(users);

      const req = getMockReq();
      const { res } = getMockRes();

      // ACT
      await UserController.all(req, res);

      // ASSERT
      expect(res.status).toBeCalledWith(StatusCodes.OK);
      expect(res.json).toBeCalledWith(users);
    });
    it("when there are NO users in the DB", async () => {
      const mockedGetAll = mockFunction(UserService.getAll);
      mockedGetAll.mockResolvedValue([]);

      const req = getMockReq();
      const { res } = getMockRes();

      // ACT
      await UserController.all(req, res);

      // ASSERT
      expect(res.status).toBeCalledWith(StatusCodes.OK);
      expect(res.json).toBeCalledWith([]);
    });
  });
});
