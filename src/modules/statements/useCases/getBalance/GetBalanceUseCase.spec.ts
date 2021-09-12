import { User } from "../../../users/entities/User";
import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase
let getBalanceUseCase: GetBalanceUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Get Balance", () => {
  let user: User;
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);

    user = await createUserUseCase.execute({
      email: "user@test.com",
      password: "1234",
      name: "User Test",
    });
  });

  it("should be able to get the balance of a logged user", async () => {
    await createStatementUseCase.execute({
      user_id: user.id,
      amount: 1000,
      description: "Deposit",
      type: "deposit" as any
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      amount: 500,
      description: "Withdraw",
      type: "withdraw" as any
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      amount: 200,
      description: "Deposit",
      type: "deposit" as any
    });

    const result = await getBalanceUseCase.execute({ user_id: user.id });

    expect(result).toHaveProperty("statement");
    expect(result.statement).toHaveLength(3);
    expect(result).toHaveProperty("balance");
    expect(result.balance).toEqual(700);
  });
})
