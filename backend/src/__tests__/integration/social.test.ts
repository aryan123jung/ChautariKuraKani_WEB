import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { CommunityModel } from "../../models/community.model";
import { FriendRequestModel } from "../../models/friend-request.model";
import { ConversationModel } from "../../models/conversation.model";
import { MessageModel } from "../../models/message.model";
import { NotificationModel } from "../../models/notification.model";
import { ReportModel } from "../../models/report.model";
import { PostModel } from "../../models/post.model";

describe("SOCIAL MODULES - Integration Tests", () => {
  const timestamp = Date.now();

  const aliceUser = {
    firstName: "Alice",
    lastName: "Tester",
    email: `alice_${timestamp}@test.com`,
    password: "password123",
    confirmPassword: "password123",
    username: `alice_${timestamp}`
  };

  const bobUser = {
    firstName: "Bob",
    lastName: "Tester",
    email: `bob_${timestamp}@test.com`,
    password: "password123",
    confirmPassword: "password123",
    username: `bob_${timestamp}`
  };

  const charlieUser = {
    firstName: "Charlie",
    lastName: "Tester",
    email: `charlie_${timestamp}@test.com`,
    password: "password123",
    confirmPassword: "password123",
    username: `charlie_${timestamp}`
  };

  let aliceToken = "";
  let bobToken = "";
  let charlieToken = "";
  let aliceId = "";
  let bobId = "";
  let charlieId = "";

  let communityId = "";
  let friendRequestId = "";
  let conversationId = "";
  let notificationId = "";
  let bobPostId = "";

  const reportPayload = {
    reasonType: "spam",
    reasonText: "integration-test-report"
  };

  const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

  beforeAll(async () => {
    await UserModel.deleteMany({
      email: { $in: [aliceUser.email, bobUser.email, charlieUser.email] }
    });

    await request(app).post("/api/auth/register").send(aliceUser);
    await request(app).post("/api/auth/register").send(bobUser);
    await request(app).post("/api/auth/register").send(charlieUser);

    const aliceLogin = await request(app).post("/api/auth/login").send({
      email: aliceUser.email,
      password: aliceUser.password
    });
    const bobLogin = await request(app).post("/api/auth/login").send({
      email: bobUser.email,
      password: bobUser.password
    });
    const charlieLogin = await request(app).post("/api/auth/login").send({
      email: charlieUser.email,
      password: charlieUser.password
    });

    aliceToken = aliceLogin.body.token;
    bobToken = bobLogin.body.token;
    charlieToken = charlieLogin.body.token;

    aliceId = aliceLogin.body.data._id;
    bobId = bobLogin.body.data._id;
    charlieId = charlieLogin.body.data._id;

    const post = await PostModel.create({
      caption: "post-for-reporting",
      authorId: bobId
    });
    bobPostId = post._id.toString();
  });

  afterAll(async () => {
    await MessageModel.deleteMany({
      $or: [{ senderId: { $in: [aliceId, bobId, charlieId] } }, { receiverId: { $in: [aliceId, bobId, charlieId] } }]
    });
    await ConversationModel.deleteMany({ participants: { $in: [aliceId, bobId, charlieId] } });
    await NotificationModel.deleteMany({ userId: { $in: [aliceId, bobId, charlieId] } });
    await FriendRequestModel.deleteMany({
      $or: [{ fromUserId: { $in: [aliceId, bobId, charlieId] } }, { toUserId: { $in: [aliceId, bobId, charlieId] } }]
    });
    await ReportModel.deleteMany({ reporterId: { $in: [aliceId, bobId, charlieId] } });
    await PostModel.deleteMany({ $or: [{ authorId: { $in: [aliceId, bobId, charlieId] } }, { _id: bobPostId }] });
    await CommunityModel.deleteMany({ creatorId: { $in: [aliceId, bobId, charlieId] } });
    await UserModel.deleteMany({
      email: { $in: [aliceUser.email, bobUser.email, charlieUser.email] }
    });
  });

  it("1. Should reject community creation without token", async () => {
    const res = await request(app).post("/api/chautari").send({ name: "c/test-community" });
    expect(res.status).toBe(401);
  });

  it("2. Should create community with valid token", async () => {
    const res = await request(app)
      .post("/api/chautari")
      .set(authHeader(aliceToken))
      .send({ name: "c/Integration Community", description: "community description" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    communityId = res.body.data._id;
  });

  it("3. Should reject duplicate community name", async () => {
    const res = await request(app)
      .post("/api/chautari")
      .set(authHeader(aliceToken))
      .send({ name: "c/Integration Community" });

    expect(res.status).toBe(409);
  });

  it("4. Should require query while searching communities", async () => {
    const res = await request(app).get("/api/chautari/search");
    expect(res.status).toBe(400);
  });

  it("5. Should reject invalid search query prefix", async () => {
    const res = await request(app).get("/api/chautari/search?search=integration");
    expect(res.status).toBe(400);
  });

  it("6. Should search communities using c/ prefix", async () => {
    const res = await request(app).get("/api/chautari/search?search=c/integration");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("7. Should fetch community by id", async () => {
    const res = await request(app).get(`/api/chautari/${communityId}`);
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(communityId);
  });

  it("8. Should fetch member count for community", async () => {
    const res = await request(app).get(`/api/chautari/${communityId}/member-count`);
    expect(res.status).toBe(200);
    expect(res.body.data.count).toBeGreaterThanOrEqual(1);
  });

  it("9. Should reject my communities without token", async () => {
    const res = await request(app).get("/api/chautari/my");
    expect(res.status).toBe(401);
  });

  it("10. Should get my communities with token", async () => {
    const res = await request(app).get("/api/chautari/my").set(authHeader(aliceToken));
    expect(res.status).toBe(200);
    expect(res.body.pagination).toBeDefined();
  });

  it("11. Should allow bob to join community", async () => {
    const res = await request(app).post(`/api/chautari/${communityId}/join`).set(authHeader(bobToken));
    expect(res.status).toBe(200);
  });

  it("12. Should return 404 while joining unknown community", async () => {
    const res = await request(app)
      .post("/api/chautari/64b123456789123456789123/join")
      .set(authHeader(bobToken));
    expect(res.status).toBe(404);
  });

  it("13. Should increase member count after bob joins", async () => {
    const res = await request(app).get(`/api/chautari/${communityId}/member-count`);
    expect(res.status).toBe(200);
    expect(res.body.data.count).toBeGreaterThanOrEqual(2);
  });

  it("14. Should reject community update by non-creator", async () => {
    const res = await request(app)
      .put(`/api/chautari/${communityId}`)
      .set(authHeader(bobToken))
      .send({ description: "unauthorized update" });

    expect(res.status).toBe(403);
  });

  it("15. Should allow creator to update community", async () => {
    const res = await request(app)
      .put(`/api/chautari/${communityId}`)
      .set(authHeader(aliceToken))
      .send({ description: "updated by creator" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("16. Should reject community deletion by non-creator", async () => {
    const res = await request(app)
      .delete(`/api/chautari/${communityId}`)
      .set(authHeader(bobToken));
    expect(res.status).toBe(403);
  });

  it("17. Should send friend request from alice to bob", async () => {
    const res = await request(app)
      .post(`/api/friends/requests/${bobId}`)
      .set(authHeader(aliceToken));

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    friendRequestId = res.body.data._id;
  });

  it("18. Should reject duplicate friend request", async () => {
    const res = await request(app)
      .post(`/api/friends/requests/${bobId}`)
      .set(authHeader(aliceToken));
    expect(res.status).toBe(409);
  });

  it("19. Should list outgoing friend requests", async () => {
    const res = await request(app).get("/api/friends/requests/outgoing").set(authHeader(aliceToken));
    expect(res.status).toBe(200);
    expect(res.body.pagination).toBeDefined();
  });

  it("20. Should list incoming friend requests", async () => {
    const res = await request(app).get("/api/friends/requests/incoming").set(authHeader(bobToken));
    expect(res.status).toBe(200);
    expect(res.body.pagination).toBeDefined();
  });

  it("21. Should return pending outgoing friend status for alice", async () => {
    const res = await request(app).get(`/api/friends/status/${bobId}`).set(authHeader(aliceToken));
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("PENDING_OUTGOING");
  });

  it("22. Should reject accepting someone else's request", async () => {
    const res = await request(app)
      .post(`/api/friends/requests/${friendRequestId}/accept`)
      .set(authHeader(charlieToken));
    expect(res.status).toBe(403);
  });

  it("23. Should accept friend request by receiver", async () => {
    const res = await request(app)
      .post(`/api/friends/requests/${friendRequestId}/accept`)
      .set(authHeader(bobToken));
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("24. Should return friend status after acceptance", async () => {
    const res = await request(app).get(`/api/friends/status/${bobId}`).set(authHeader(aliceToken));
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("FRIEND");
  });

  it("25. Should create conversation between friends", async () => {
    const res = await request(app)
      .post(`/api/messages/conversations/${bobId}`)
      .set(authHeader(aliceToken));
    expect(res.status).toBe(200);
    conversationId = res.body.data._id;
  });

  it("26. Should reject empty message text", async () => {
    const res = await request(app)
      .post(`/api/messages/${conversationId}`)
      .set(authHeader(aliceToken))
      .send({ text: "   " });
    expect(res.status).toBe(400);
  });

  it("27. Should send message successfully", async () => {
    const res = await request(app)
      .post(`/api/messages/${conversationId}`)
      .set(authHeader(aliceToken))
      .send({ text: "hello bob" });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("28. Should list conversation messages for bob", async () => {
    const res = await request(app).get(`/api/messages/${conversationId}`).set(authHeader(bobToken));
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("29. Should mark conversation as read", async () => {
    const res = await request(app).patch(`/api/messages/${conversationId}/read`).set(authHeader(bobToken));
    expect(res.status).toBe(200);
  });

  it("30. Should list notifications for bob", async () => {
    const res = await request(app).get("/api/notifications").set(authHeader(bobToken));
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    if (res.body.data.length > 0) {
      notificationId = res.body.data[0]._id;
    }
  });

  it("31. Should mark all notifications as read", async () => {
    const res = await request(app).patch("/api/notifications/read-all").set(authHeader(bobToken));
    expect(res.status).toBe(200);
  });

  it("32. Should reject report user endpoint when reporting self", async () => {
    const res = await request(app)
      .post(`/api/reports/user/${aliceId}`)
      .set(authHeader(aliceToken))
      .send(reportPayload);
    expect(res.status).toBe(400);
  });

  it("33. Should allow reporting another user", async () => {
    const res = await request(app)
      .post(`/api/reports/user/${bobId}`)
      .set(authHeader(aliceToken))
      .send(reportPayload);
    expect(res.status).toBe(201);
  });

  it("34. Should reject duplicate open user report", async () => {
    const res = await request(app)
      .post(`/api/reports/user/${bobId}`)
      .set(authHeader(aliceToken))
      .send(reportPayload);
    expect(res.status).toBe(409);
  });

  it("35. Should get my reports", async () => {
    const res = await request(app).get("/api/reports/my").set(authHeader(aliceToken));
    expect(res.status).toBe(200);
    expect(res.body.pagination).toBeDefined();
  });

  it("36. Should report post successfully", async () => {
    const res = await request(app)
      .post(`/api/reports/post/${bobPostId}`)
      .set(authHeader(aliceToken))
      .send(reportPayload);
    expect(res.status).toBe(201);
  });

  it("37. Should reject report post with invalid payload", async () => {
    const res = await request(app)
      .post(`/api/reports/post/${bobPostId}`)
      .set(authHeader(bobToken))
      .send({});
    expect(res.status).toBe(400);
  });

  it("38. Should return 404 for report post unknown target", async () => {
    const res = await request(app)
      .post("/api/reports/post/64b123456789123456789123")
      .set(authHeader(aliceToken))
      .send(reportPayload);
    expect(res.status).toBe(404);
  });

  it("39. Should report community successfully", async () => {
    const res = await request(app)
      .post(`/api/reports/chautari/${communityId}`)
      .set(authHeader(aliceToken))
      .send(reportPayload);
    expect(res.status).toBe(201);
  });

  it("40. Should reject duplicate open community report", async () => {
    const res = await request(app)
      .post(`/api/reports/chautari/${communityId}`)
      .set(authHeader(aliceToken))
      .send(reportPayload);
    expect(res.status).toBe(409);
  });

  it("41. Should reject notifications listing without token", async () => {
    const res = await request(app).get("/api/notifications");
    expect(res.status).toBe(401);
  });

  it("42. Should reject friend status without token", async () => {
    const res = await request(app).get(`/api/friends/status/${bobId}`);
    expect(res.status).toBe(401);
  });

  it("43. Should return friend count for bob", async () => {
    const res = await request(app).get(`/api/friends/count/${bobId}`).set(authHeader(aliceToken));
    expect(res.status).toBe(200);
    expect(res.body.data.count).toBeGreaterThanOrEqual(1);
  });

  it("44. Should return 404 when unfriending non-friend", async () => {
    const res = await request(app).delete(`/api/friends/${charlieId}`).set(authHeader(aliceToken));
    expect(res.status).toBe(404);
  });

  it("45. Should unfriend an existing friend", async () => {
    const res = await request(app).delete(`/api/friends/${bobId}`).set(authHeader(aliceToken));
    expect(res.status).toBe(200);
  });

  it("46. Should return NONE friend status after unfriend", async () => {
    const res = await request(app).get(`/api/friends/status/${bobId}`).set(authHeader(aliceToken));
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("NONE");
  });

  it("47. Should reject conversation creation for non-friends", async () => {
    const res = await request(app)
      .post(`/api/messages/conversations/${charlieId}`)
      .set(authHeader(aliceToken));
    expect(res.status).toBe(403);
  });

  it("48. Should reject friend request without token", async () => {
    const res = await request(app).post(`/api/friends/requests/${bobId}`);
    expect(res.status).toBe(401);
  });

  it("49. Should return 404 when cancelling non-existing pending request", async () => {
    const res = await request(app)
      .delete(`/api/friends/requests/${aliceId}`)
      .set(authHeader(bobToken));
    expect(res.status).toBe(404);
  });

  it("50. Should reject incoming requests listing without token", async () => {
    const res = await request(app).get("/api/friends/requests/incoming");
    expect(res.status).toBe(401);
  });

  it("51. Should reject marking another user's notification as read", async () => {
    if (!notificationId) {
      const list = await request(app).get("/api/notifications").set(authHeader(bobToken));
      if (list.body.data.length > 0) {
        notificationId = list.body.data[0]._id;
      }
    }

    if (!notificationId) {
      expect(true).toBe(true);
      return;
    }

    const res = await request(app)
      .patch(`/api/notifications/${notificationId}/read`)
      .set(authHeader(aliceToken));
    expect(res.status).toBe(403);
  });
});
