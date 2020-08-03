import { getCustomRepository } from 'typeorm';
import { BalanceModel } from '../businessModels/BalanceModel';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import ListTransactionsModel from '../businessModels/ListTransactionsModel';

export default class ListAllTransactionsService {
  private static getTransactionsSumByType(
    transactions: Transaction[],
    type: string,
  ): number {
    return transactions.reduce((total: number, transaction: Transaction) => {
      return transaction.type === type
        ? Number(transaction.value) + total
        : total;
    }, 0);
  }

  public static getBalance(transactions: Transaction[]): BalanceModel {
    const incomes = this.getTransactionsSumByType(transactions, 'income');
    const outcomes = this.getTransactionsSumByType(transactions, 'outcome');
    const balance = {
      income: incomes,
      outcome: outcomes,
      total: incomes - outcomes,
    };
    return balance;
  }

  public async getAll(): Promise<ListTransactionsModel> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const transactions = await transactionRepository.getAll();
    const balance = await ListAllTransactionsService.getBalance(transactions);
    return ListTransactionsModel.instance()
      .withBalance(balance)
      .withTransactions(transactions)
      .normalize();
  }
}
