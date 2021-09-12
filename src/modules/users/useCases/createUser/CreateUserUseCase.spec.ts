import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create a user", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com",
      password: "1234",
      name: "User Test",
    };

    const result =  await createUserUseCase.execute(user);

    expect(result).toHaveProperty("id");
  });

  it("should not be able to create a duplicated user", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "user@test.com",
        password: "1234",
        name: "User Test",
      };

      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(AppError);
  });
});
