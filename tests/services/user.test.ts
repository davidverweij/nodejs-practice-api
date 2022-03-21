import User from "../../src/models/user";
import { UserService } from "../../src/services";
import mockFunction from "../jestHelpers";

// Mock Dependencies
jest.mock("../../src/models/user");

const mockedFindAll = mockFunction(User.findAll);

describe("UserService.getAutoSuggest", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should default to NO limit", async () => {
    // ACT
    await UserService.getAutoSuggest("test");

    // ASSERT
    expect(mockedFindAll).toBeCalledWith(
      expect.objectContaining({ limit: undefined })
    );
  });

  it("should pass through any positive limit", async () => {
    const expected = 77;

    // ACT
    await UserService.getAutoSuggest("test", expected);

    // ASSERT
    expect(mockedFindAll).toBeCalledWith(
      expect.objectContaining({ limit: expected })
    );
  });

  it("should ignore negative limits", async () => {
    // ACT
    await UserService.getAutoSuggest("test", -23);

    // ASSERT
    expect(mockedFindAll).toBeCalledWith(
      expect.objectContaining({ limit: undefined })
    );
  });
});
