import { StatementsRepository } from "../../repositories/StatementsRepository";
import { inject, injectable } from "tsyringe";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { UsersRepository } from "../../../users/repositories/UsersRepository";

interface IRequest {
  sender_id: string;
  receiver_id: string;
  amount: number;
  description: string;
}

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

@injectable()
class TransferUseCase {
  constructor(
    @inject("StatementsRepository")
    private statementsRepository: StatementsRepository,
    @inject("UsersRepository")
    private usersRepository: UsersRepository
  ) {}

  async execute({ sender_id, receiver_id, amount, description}: IRequest): Promise<void> {
    const receiverExists = await this.usersRepository.findById(receiver_id);

    if (!receiverExists) {
      throw new CreateStatementError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds();
    }

    await this.statementsRepository.create({
      user_id: sender_id,
      amount,
      description,
      type: OperationType.TRANSFER as any
    });

    await this.statementsRepository.create({
      user_id: receiver_id,
      amount,
      description,
      type: OperationType.TRANSFER as any,
      sender_id
    });
  }
}

export { TransferUseCase }
