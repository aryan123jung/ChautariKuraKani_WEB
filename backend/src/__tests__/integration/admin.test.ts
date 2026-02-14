import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import bcrypt from "bcryptjs";

describe("ADMIN CONTROLLER - Integration Tests", () => {
  let adminToken: string;
  let createdUserId: string;
  const adminEmail = `admintest_${Date.now()}@test.com`; // unique email for each run

  beforeAll(async () => {
  const timestamp = Date.now();
  const adminEmail = `admintest_${timestamp}@test.com`;
  const adminUsername = `admintest_${timestamp}`;

  // Removing leftover admin users
  await UserModel.deleteMany({ $or: [{ email: adminEmail }, { username: adminUsername }] });

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Creating admin
  await UserModel.create({
    firstName: "Adminnn",
    lastName: "User",
    email: adminEmail,
    password: hashedPassword,
    username: adminUsername,
    role: "admin",
  });

  // Login admin
  const login = await request(app)
    .post("/api/auth/login")
    .send({
      email: adminEmail,
      password: "password123",
    });

  console.log("Admin login response:", login.body);

  // mero token path
  if (!login.body.token) throw new Error("Admin login failed");

  adminToken = login.body.token;
});



  afterAll(async () => {
    // Cleanup: delete any users created during tests
    await UserModel.deleteMany({ email: /test\.com$/ });
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
        email: `newuser_${Date.now()}@test.com`,
        password: "password123",
        confirmPassword: "password123",
        username: `newuser_${Date.now()}`,
      });

    expect(res.status).toBe(201);
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
    // Creating a regular user for this test
    const userEmail = `user_${Date.now()}@test.com`;
    const hashedPassword = await bcrypt.hash("password123", 10);
    await UserModel.create({
        firstName: "John",
        lastName: "Doe",
        email: userEmail,
        password: hashedPassword,
        username: `john${Date.now()}`,
        role: "user",
    });

    // Login as regular user
    const userLogin = await request(app)
        .post("/api/auth/login")
        .send({ email: userEmail, password: "password123" });

    
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
  });

  // 25
  it("25. Admin delete non-existing user", async () => {
    const res = await request(app)
      .delete("/api/admin/users/64b123456789123456789123")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });
});
