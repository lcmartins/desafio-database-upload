import Transaction from '../models/Transaction';
import { BalanceModel } from './BalanceModel';

export default class ListTransactionsModel {
  private static _self: ListTransactionsModel;

  private balance: BalanceModel;

  private transactions: Transaction[] = [];

  public static instance(): ListTransactionsModel {
    if (
      ListTransactionsModel._self === null ||
      ListTransactionsModel._self === undefined
    ) {
      ListTransactionsModel._self = new ListTransactionsModel();
    }
    return ListTransactionsModel._self;
  }

  public getBalance(): BalanceModel {
    return ListTransactionsModel.instance().balance;
  }

  public withBalance(balance: BalanceModel): ListTransactionsModel {
    ListTransactionsModel.instance().balance = balance;
    return ListTransactionsModel.instance();
  }

  public withTransactions(transactions: Transaction[]): ListTransactionsModel {
    ListTransactionsModel.instance().transactions = transactions;
    return ListTransactionsModel.instance();
  }

  public normalize(): ListTransactionsModel {
    for (
      let index = 0;
      index < ListTransactionsModel.instance().transactions.length;
      index += 1
    ) {
      delete this.transactions[index].category_id;
    }
    return ListTransactionsModel.instance();
  }
}
