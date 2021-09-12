import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { AppError } from "../../../../shared/errors/AppError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { User } from "../../../users/entities/User";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  let user: User;

  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementRepositoryInMemory);
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementRepositoryInMemory);

    user = await createUserUseCase.execute({
      email: "user@test.com",
      password: "1234",
      name: "User Test",
    });
  });

  it("should be able to get statement operation", async () => {
    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      amount: 1000,
      description: "Deposit",
      type: "deposit" as any
    });

    const result = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id
    });

    expect(result).toBeDefined();
    expect(result).toEqual(statement);
  });

  it("should not be able to get statement that does not belong to the user", async () => {
    expect(async () => {
      const otherUser = await createUserUseCase.execute({
        email: "user2@test.com",
        password: "1234",
        name: "User2 Test",
      });

      const statement = await createStatementUseCase.execute({
        user_id: user.id,
        amount: 1000,
        description: "Deposit",
        type: "deposit" as any
      });

      await getStatementOperationUseCase.execute({
        user_id: otherUser.id,
        statement_id: statement.id
      });
    }).rejects.toBeInstanceOf(AppError);
  })
})
