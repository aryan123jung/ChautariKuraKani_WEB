import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import bcrypt from "bcryptjs";

describe("ADMIN CONTROLLER - Integration Tests", () => {
  let adminToken: string;
  let createdUserId: string;
  const timestamp = Date.now();
  const adminEmail = `admintest_${timestamp}@test.com`;
  const adminUsername = `admintest_${timestamp}`;
  const regularUserEmail = `normaluser_${timestamp}@test.com`;
  const createdUserEmail = `newuser_${timestamp}@test.com`;
  const createdUserUsername = `newuser_${timestamp}`;

  beforeAll(async () => {
    await UserModel.deleteMany({
      $or: [
        { email: adminEmail },
        { username: adminUsername },
        { email: regularUserEmail },
        { email: createdUserEmail },
        { username: createdUserUsername }
      ]
    });

    const hashedPassword = await bcrypt.hash("password123", 10);

    await UserModel.create({
      firstName: "Admin",
      lastName: "User",
      email: adminEmail,
      password: hashedPassword,
      username: adminUsername,
      role: "admin"
    });

    const login = await request(app).post("/api/auth/login").send({
      email: adminEmail,
      password: "password123"
    });

    if (!login.body?.token) {
      throw new Error(`Admin login failed. Response: ${JSON.stringify(login.body)}`);
    }
    adminToken = login.body.token;
  });


  afterAll(async () => {
    await UserModel.deleteMany({
      $or: [
        { email: adminEmail },
        { username: adminUsername },
        { email: regularUserEmail },
        { email: createdUserEmail },
        { username: createdUserUsername }
      ]
    });
  });

  // 16
  it("16. Admin route should work", async () => {
    const res = await request(app)
      .get("/api/admin/users/test")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
  });

  // 17
  it("17. Admin create user", async () => {
    const res = await request(app)
      .post("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        firstName: "New",
        lastName: "User",
        email: createdUserEmail,
        password: "password123",
        confirmPassword: "password123",
        username: createdUserUsername
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    createdUserId = res.body.data._id;
  });

  // 18
  it("18. Admin get all users", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
  });

  // 19
  it("19. Admin get user by id", async () => {
    const res = await request(app)
      .get(`/api/admin/users/${createdUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
  });

  // 20
  it("20. Admin update user", async () => {
    const res = await request(app)
      .put(`/api/admin/users/${createdUserId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ firstName: "UpdatedAdmin" });

    expect(res.status).toBe(200);
  });

  // 21
  it("21. Admin delete user", async () => {
    const res = await request(app)
      .delete(`/api/admin/users/${createdUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
  });

  // 22
  it("22. Should fail without token", async () => {
    const res = await request(app).get("/api/admin/users");
    expect(res.status).toBe(401);
  });

  // 23
  it("23. Should fail if not admin", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    await UserModel.create({
      firstName: "John",
      lastName: "Doe",
      email: regularUserEmail,
      password: hashedPassword,
      username: `john${timestamp}`,
      role: "user"
    });

    const userLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: regularUserEmail, password: "password123" });
    const token = userLogin.body.token;

    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });


  // 24
  it("24. Admin pagination test", async () => {
    const res = await request(app)
      .get("/api/admin/users?page=1&size=5")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.size).toBe(5);
  });

  // 25
  it("25. Admin delete non-existing user", async () => {
    const res = await request(app)
      .delete("/api/admin/users/64b123456789123456789123")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });
});
