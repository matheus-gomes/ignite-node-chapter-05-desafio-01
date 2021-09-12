import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferUseCase } from "./TransferUseCase";

class TransferController {
  async execute(request: Request, response: Response): Promise<Response> {
    const sender_id = request.user.id;
    const receiver_id = request.params.user_id;

    const { amount, description } = request.body;

    const transferUseCase = container.resolve(TransferUseCase);

    await transferUseCase.execute({ sender_id, receiver_id, amount, description });

    return response.status(201).send();
  }
}

export { TransferController}
