import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

// we are augmenting the global object with sign in helper function
declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>;
    }
  }
}
let mongo: any;
// runs before all tests
beforeAll(async () => {
  process.env.JWT_KEY = "whatevstring";

  // starts mongob memory server
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// runs before each of our tests
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  // deletes all the collections that exist in db
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// runs after all tests are complete
afterAll(async () => {
  // stop mongo server
  await mongo.stop();
  await mongoose.connection.close();
});

// helps us sign in while testing
global.signin = async () => {
  const email = "test@patriots.uttyler.edu";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  return cookie;
};
