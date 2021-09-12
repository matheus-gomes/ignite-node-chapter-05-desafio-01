import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { AppError } from "../../../../shared/errors/AppError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementRepositoryInMemory);
  });

  it("should be able to create a deposit statement", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com",
      password: "1234",
      name: "User Test",
    };

    const userCreated = await createUserUseCase.execute(user);

    const statement = await createStatementUseCase.execute({
      user_id: userCreated.id,
      amount: 200,
      description: "deposit",
      type: "deposit" as any
    });

    expect(statement).toHaveProperty("id");
    expect(statement.type).toBe("deposit");
  });

  it("should be able to create a withdraw statement", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com",
      password: "1234",
      name: "User Test",
    };

    const userCreated = await createUserUseCase.execute(user);

    await createStatementUseCase.execute({
      user_id: userCreated.id,
      amount: 500,
      description: "deposit",
      type: "deposit" as any
    });

    const statement = await createStatementUseCase.execute({
      user_id: userCreated.id,
      amount: 200,
      description: "withdraw",
      type: "withdraw" as any
    });

    expect(statement).toHaveProperty("id");
    expect(statement.type).toBe("withdraw");
  });

  it("should not be able to do a withdraw statement with insufficient funds", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "user@test.com",
        password: "1234",
        name: "User Test",
      };

      const userCreated = await createUserUseCase.execute(user);


      await createStatementUseCase.execute({
        user_id: userCreated.id,
        amount: 200,
        description: "withdraw",
        type: "withdraw" as any
      });
    }).rejects.toBeInstanceOf(AppError);
  })
})
