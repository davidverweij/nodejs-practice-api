const mockFunction = <T extends (...args: any[]) => any>(
  fn: T
): jest.MockedFunction<T> => fn as jest.MockedFunction<T>;

export default mockFunction;
