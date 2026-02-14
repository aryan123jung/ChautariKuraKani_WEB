// import request from 'supertest';
// import app from '../../app';
// import { UserModel } from '../../models/user.model';

// describe(
//     'Authentication Integration Tests', // descibe test suite
//     () => { // what to run 
//         const testUser = { // according to your UserModel
//             firstName: 'Test',
//             lastName: 'User',
//             email: 'test@example.com',
//             password: 'password123',
//             confirmPassword: 'password123',
//             username: 'testuser'
//         }
//         beforeAll(async () => {
//             await UserModel.deleteMany({ email: testUser.email }); //duplicate email delete garcha
//         });
//         afterAll(async () => {
//             await UserModel.deleteMany({ email: testUser.email }); // test bhaisakesi test bhako email delete garcha
//         });

//         describe(
//             'POST /api/auth/register', // nested describe block
//             () => {
//                 test( // actual test case
//                     'should register a new user', // test case description
//                     async () => { // test case implementation
//                         const response = await request(app)
//                             .post('/api/auth/register')
//                             .send(testUser)
//                         //api call garisakepachi expect function chalaune
//                         expect(response.status).toBe(201);
//                         expect(response.body).toHaveProperty(
//                             'message', 
//                             'Register Successful'
//                         );
//                     }
//                 )
//             }
//         )
//     }
// );



import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../configs";

describe("AUTH CONTROLLER - Integration Tests", () => {

    const normalUser = {
        firstName: "John",
        lastName: "Doe",
        email: "john@test.com",
        password: "password123",
        confirmPassword: "password123",
        username: "johnny"
    };

    let token: string;
    let userId: string;

    beforeAll(async () => {
        await UserModel.deleteMany({ email: normalUser.email });
    });

    afterAll(async () => {
        await UserModel.deleteMany({ email: normalUser.email });
    });

    // ================= REGISTER =================

    it("1. Should register user", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send(normalUser);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        userId = res.body.data._id;
    });

    it("2. Should not allow duplicate email", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send(normalUser);

        expect(res.status).toBe(409);
    });

    it("3. Should fail with invalid body", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ email: "bademail" });

        expect(res.status).toBe(400);
    });

    // ================= LOGIN =================

    it("4. Should login successfully", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: normalUser.email,
                password: normalUser.password
            });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        token = res.body.token;
    });

    it("5. Should fail login with wrong password", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: normalUser.email,
                password: "wrongpass"
            });

        expect(res.status).toBe(401);
    });

    it("6. Should fail login with invalid body", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "invalid" });

        expect(res.status).toBe(400);
    });

    // ================= WHOAMI =================

    it("7. Should fail without token", async () => {
        const res = await request(app)
            .get("/api/auth/whoami");

        expect(res.status).toBe(401);
    });

    it("8. Should fail with invalid token", async () => {
        const res = await request(app)
            .get("/api/auth/whoami")
            .set("Authorization", "Bearer invalidtoken");

        expect(res.status).toBe(401);
    });

    it("9. Should get current user with valid token", async () => {
        const res = await request(app)
            .get("/api/auth/whoami")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data.email).toBe(normalUser.email);
    });

    // ================= GET USER BY ID =================

    it("10. Should deny access to another user data", async () => {
        const fakeId = "64b123456789123456789123";

        const res = await request(app)
            .get(`/api/auth/user/${fakeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(403);
    });

    it("11. Should allow access to own user data", async () => {
        const res = await request(app)
            .get(`/api/auth/user/${userId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
    });

    // ================= UPDATE PROFILE =================

    it("12. Should fail update without token", async () => {
        const res = await request(app)
            .put("/api/auth/update-profile")
            .send({ firstName: "Updated" });

        expect(res.status).toBe(401);
    });

    it("13. Should update profile successfully", async () => {
        const res = await request(app)
            .put("/api/auth/update-profile")
            .set("Authorization", `Bearer ${token}`)
            .send({ firstName: "UpdatedName" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    // ================= PASSWORD RESET =================

    it("14. Should send reset email", async () => {
        const res = await request(app)
            .post("/api/auth/send-reset-password-email")
            .send({ email: normalUser.email });

        expect(res.status).toBe(200);
    });

    it("15. Should fail reset with invalid token", async () => {
        const res = await request(app)
            .post("/api/auth/reset-password/invalidtoken")
            .send({ newPassword: "newpass123" });

        expect(res.status).toBeGreaterThanOrEqual(400);
    });

});
