const request = require("supertest");
const {app,userModel} = require("../index");
const client=require('../util/redis');

beforeAll(done => {
  done()
})

describe("GET /", function () {
  test('should return "Server is running"', function (done) {
    request(app)
      .get("/")
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.text).toBeDefined();
        done();
      });
  });
});


describe("POST /signin", () => {
  test("should return a success message", async () => {
    const credentials = {
      email: "praneetmanchala@gmail.com",
      password: "1234@",
    };

    const res = await request(app)
      .post("/signin")
      .send(credentials);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  }, 15000);

  test("should return 403 for invalid password", async () => {
    const credentials = {
      email: "praneetmanchala@gmail.com",
      password: "1234",
    };

    const res = await request(app)
      .post("/signin")
      .send(credentials);

    expect(res.status).toBe(403);
  }, 5000);

});

describe("GET /api/datas", () => {
    test("should return users data", (done) => {
      request(app)
        .get("/api/datas")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
            expect(res.body).toBeDefined();
          done();
        })
        .catch((err) => done(err));
    }, 10000);
  
  });
  




afterAll(async () => {
  await client.quit(); 
});