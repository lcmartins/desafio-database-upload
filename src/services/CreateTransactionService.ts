import { getRepository, getCustomRepository } from 'typeorm';
import { TransactionModel } from '../businessModels/TransactionModel';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';
import ListAllTransactionsService from './ListAllTransactionsService';
import AppError from '../errors/AppError';

class CreateTransactionService {
  public async execute(
    transactionRequest: TransactionModel,
  ): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    let existingCategory = await categoryRepository.findOne({
      title: transactionRequest.category,
    });

    if (!existingCategory) {
      existingCategory = await categoryRepository.create({
        title: transactionRequest.category,
        created_at: new Date(),
        updated_at: new Date(),
      });
      await categoryRepository.save(existingCategory);
    }
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const transactions = await transactionRepository
      .createQueryBuilder('transactions')
      .getMany();
    if (
      transactionRequest.type === 'outcome' &&
      ListAllTransactionsService.getBalance(transactions).total <
        transactionRequest.value
    ) {
      throw new AppError('error', 400);
    }
    const transaction = await transactionRepository.create({
      title: transactionRequest.title,
      category: existingCategory,
      type: transactionRequest.type,
      value: transactionRequest.value,
    });
    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
