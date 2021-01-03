//jshint esversion:8
const app=require("../src/app");
const request=require("supertest");
const Task=require("../src/models/task");
const {user1Id,
    user1,
    user2Id,
    user2,
    task1,
    task2,
    task3,
    setDatabase}=require("./fixtures/db");
beforeEach(setDatabase);

test("should create task for user",async()=>{
    const response=await request(app)
    .post("/tasks")
    .set("Authorization",`Bearer ${user1.tokens[0].token}`)
    .send({
        description:"from my test"
    }).expect(201);
    const task=await Task.findById(response.body._id)
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);

});
test("should get all task",async()=>{
    const response=await request(app)
    .get("/tasks")
    .set("Authorization",`Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200);
    expect(response.body.length).toEqual(2);
});

test("should not delete other task",async()=>{
    const response=await request(app)
    .delete("/tasks/${taskOne._id}")
    .set("Authorization",`Bearer ${user2.tokens[0].token}`)
    .send()
    .expect(404);
    const task=Task.findById(task1._id)
    expect(task).not.toBeNull();
});