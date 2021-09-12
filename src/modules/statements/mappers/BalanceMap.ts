import { Statement } from "../entities/Statement";

export class BalanceMap {
  static toDTO({statement, balance}: { statement: Statement[], balance: number}) {
    const parsedStatement = statement.map(({
      id,
      sender_id,
      amount,
      description,
      type,
      created_at,
      updated_at
    }) => {
      const dto = {
        id,
        sender_id: sender_id,
        amount: Number(amount),
        description,
        type,
        created_at,
        updated_at
      }

      if (!dto.sender_id) {
        delete dto.sender_id;
      }

      return dto;
    });

    return {
      statement: parsedStatement,
      balance: Number(balance)
    }
  }
}
