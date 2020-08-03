import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getAll(): Promise<Transaction[]> {
    const transactions = await this.createQueryBuilder('transactions')
      .innerJoinAndSelect('transactions.category', 'category')
      .getMany();
    return transactions;
  }
}

export default TransactionsRepository;
