import jwt, { JwtPayload } from "jsonwebtoken";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const mockFunction = <T extends (...args: any[]) => any>(
  fn: T
): jest.MockedFunction<T> => fn as jest.MockedFunction<T>;

const validateToken = (token: string): boolean => {
  const decoded = jwt.decode(token) as JwtPayload;
  const expiry = decoded.exp as number;
  const valid = Date.now() <= expiry * 1000;
  return valid;
};

export { uuidRegex, mockFunction, validateToken };
