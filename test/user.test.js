//jshint esversion:8
const request=require("supertest");
const app=require("../src/app");
const User=require("../src/models/user");
const {user1Id,user1,setDatabase}=require("./fixtures/db");

beforeEach(setDatabase);

test("should signup a new user",async()=>{
    const response=await request(app).post("/users").send({
        name:"Andrew",
        email:"Andrew@example.com",
        password:"Andrew@1122"
    }).expect(201);
    //Assert that the database is changed correctly
    const user=await User.findById(response.body.user._id);
    expect(user).not.toBeNull();
    //asertion about the response
    expect(response.body).toMatchObject({
        user:{name:"Andrew",
        email:"Andrew@example.com",
        },
        token:user.tokens[0].token
    })
    expect(user.password).not.toBe("Andrew@1122");
});
test("should login existing user",async()=>{
    const response=await  request(app).post("/users/login").send({
        email:user1.email,
        password:user1.password
    }).expect(200);
    const user=await User.findById(user1Id)
    expect(response.body.token).toBe(user.tokens[1].token);
});

test("should not login non existant user", async()=>{
    await request(app).post("/users/login").send({
        email:user1.email,
        password:"entho"
    }).expect(400);
});
test("should get profile for user",async ()=>{
    await request(app)
    .get("/users/me")
    .set("Authorization",`Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should not get profile for unauthenticated user",async()=>{
    await request(app)
    .get("/users/me")
    .send().expect(401);
});
test("should delete account for user",async()=>{
    await request(app)
    .delete("/users/me")
    .set("Authorization",`Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200);
    const user =await User.findById(user1Id);
    expect(user).toBeNull();
});

test("should not delete account for user not having auth",async()=>{
    await request(app)
    .delete("/users/me")
    .send().expect(401);
});
test ("should upload avatar image",async()=>{
    await request(app).post("/users/me/avatar")
    .set("Authorization",`Bearer ${user1.tokens[0].token}`)
    .attach("avatar","test/fixtures/profile-pic.jpg")
    .expect(200);
    const user=await User.findById(user1Id);
    expect(user.avatar).toEqual(expect.any(Buffer));
});
test("should update valid user field",async()=>{
    await request(app).patch("/users/me")
    .set("Authorization",`Bearer ${user1.tokens[0].token}`)
    .send({
        name:"jess"
    }).expect(200);
    const user=await User.findById(user1Id)
    expect (user.name).toEqual("jess")
});
test ("should not update invalid user field",async()=>{
    await request(app).patch("/users/me")
    .set("Authorization",`Bearer ${user1.tokens[0].token}`)
    .send({
        location:"india"
    }).expect(400);
})