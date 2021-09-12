import { Connection } from "typeorm";
import request from "supertest";

import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection;
describe("Create User", () => {
  beforeEach(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "User",
      email: "user@test.com",
      password: "123456"
    });

    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

    console.log(response.status);
  })
})
