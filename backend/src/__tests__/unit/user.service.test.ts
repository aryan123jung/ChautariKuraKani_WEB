const mockUserRepository = {
  getUserByEmail: jest.fn(),
  getUserByUsername: jest.fn(),
  createUser: jest.fn(),
  getUserById: jest.fn(),
  searchUsersForUser: jest.fn(),
  updateUser: jest.fn()
};

const mockHash = jest.fn();
const mockCompare = jest.fn();
const mockSign = jest.fn();
const mockVerify = jest.fn();
const mockSendEmail = jest.fn();

jest.mock("../../repositories/user.repository", () => ({
  UserRepository: jest.fn(() => mockUserRepository)
}));

jest.mock("bcryptjs", () => ({
  hash: (...args: any[]) => mockHash(...args),
  compare: (...args: any[]) => mockCompare(...args)
}));

jest.mock("jsonwebtoken", () => ({
  sign: (...args: any[]) => mockSign(...args),
  verify: (...args: any[]) => mockVerify(...args)
}));

jest.mock("../../configs/email", () => ({
  sendEmail: (...args: any[]) => mockSendEmail(...args)
}));

import { UserService } from "../../services/user.services";

describe("UserService (unit)", () => {
  const service = new UserService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("registers user when email and username are unique", async () => {
    mockUserRepository.getUserByEmail.mockResolvedValue(null);
    mockUserRepository.getUserByUsername.mockResolvedValue(null);
    mockHash.mockResolvedValue("hashed-pass");
    mockUserRepository.createUser.mockResolvedValue({
      toObject: () => ({ _id: "u1", email: "john@test.com", password: "hashed-pass" })
    });

    const result = await service.registerUser({
      firstName: "John",
      lastName: "Doe",
      username: "john",
      email: "john@test.com",
      password: "password123",
      confirmPassword: "password123",
      role: "user"
    });

    expect(mockHash).toHaveBeenCalled();
    expect((result as any).password).toBeUndefined();
  });

  it("rejects registration when email already exists", async () => {
    mockUserRepository.getUserByEmail.mockResolvedValue({ _id: "u1" });
    await expect(
      service.registerUser({
        firstName: "John",
        lastName: "Doe",
        username: "john",
        email: "john@test.com",
        password: "password123",
        confirmPassword: "password123",
        role: "user"
      })
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it("logs in valid user and returns token", async () => {
    mockUserRepository.getUserByEmail.mockResolvedValue({
      _id: "u1",
      email: "john@test.com",
      password: "hashed",
      role: "user",
      accountStatus: "active"
    });
    mockCompare.mockResolvedValue(true);
    mockSign.mockReturnValue("jwt-token");

    const result = await service.loginUser({ email: "john@test.com", password: "password123" });

    expect(result.token).toBe("jwt-token");
    expect(result.user.email).toBe("john@test.com");
  });

  it("rejects login when password is invalid", async () => {
    mockUserRepository.getUserByEmail.mockResolvedValue({
      _id: "u1",
      email: "john@test.com",
      password: "hashed",
      role: "user",
      accountStatus: "active"
    });
    mockCompare.mockResolvedValue(false);
    await expect(service.loginUser({ email: "john@test.com", password: "badpass" })).rejects.toMatchObject({
      statusCode: 401
    });
  });

  it("rejects login when user is banned", async () => {
    mockUserRepository.getUserByEmail.mockResolvedValue({
      _id: "u1",
      email: "john@test.com",
      password: "hashed",
      role: "user",
      accountStatus: "banned"
    });
    await expect(service.loginUser({ email: "john@test.com", password: "password123" })).rejects.toMatchObject({
      statusCode: 403
    });
  });

  it("searches users and returns pagination", async () => {
    mockUserRepository.searchUsersForUser.mockResolvedValue({
      users: [{ _id: "u2" }],
      total: 1
    });

    const result = await service.searchUsersForUser("u1", "1", "10", "john");

    expect(result.pagination.totalUsers).toBe(1);
    expect(result.users.length).toBe(1);
  });

  it("sends reset password email for web flow", async () => {
    mockUserRepository.getUserByEmail.mockResolvedValue({
      _id: "u1",
      email: "john@test.com"
    });
    mockSign.mockReturnValue("reset-token");
    mockSendEmail.mockResolvedValue(true);

    const result = await service.sendResetPasswordEmail("john@test.com", "web");
    expect(result.email).toBe("john@test.com");
    expect(mockSendEmail).toHaveBeenCalled();
  });

  it("resets password with valid jwt token", async () => {
    mockVerify.mockReturnValue({ id: "u1" });
    mockUserRepository.getUserById.mockResolvedValue({ _id: "u1", email: "john@test.com" });
    mockHash.mockResolvedValue("new-hash");
    mockUserRepository.updateUser.mockResolvedValue({ _id: "u1" });

    await expect(service.resetPassword("token", "newpassword123")).resolves.toBeDefined();
    expect(mockUserRepository.updateUser).toHaveBeenCalledWith("u1", { password: "new-hash" });
  });

  it("rejects reset password with invalid jwt token", async () => {
    mockVerify.mockImplementation(() => {
      throw new Error("invalid");
    });

    await expect(service.resetPassword("bad-token", "newpassword123")).rejects.toMatchObject({ statusCode: 400 });
  });
});
