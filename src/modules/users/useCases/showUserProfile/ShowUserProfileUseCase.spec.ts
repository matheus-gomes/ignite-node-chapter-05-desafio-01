import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  it("should be able to show the profile of an authenticated user", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com",
      password: "1234",
      name: "User Test",
    };

    const userCreated = await createUserUseCase.execute(user);

    const profile = await showUserProfileUseCase.execute(userCreated.id);

    expect(profile).toHaveProperty("id");
    expect(profile).toHaveProperty("name");
    expect(profile).toHaveProperty("email");
    expect(profile).toHaveProperty("password");
  });

  it("should not be able to show the profile of an inexistent user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("");
    }).rejects.toBeInstanceOf(AppError);
  });


});
