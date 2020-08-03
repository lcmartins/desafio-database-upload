import fs from 'fs';
import path from 'path';

import csvParse from 'csv-parse';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';
import { TransactionModel } from '../businessModels/TransactionModel';

class ImportTransactionsService {
  async execute(file: string): Promise<TransactionModel[]> {
    const filePath = path.join(uploadConfig.directory, file);
    const lines = await this.loadCSV(filePath);
    await fs.promises.unlink(filePath);
    const transactions: TransactionModel[] = [];

    const transactionService = new CreateTransactionService();

    for (let i = 1; i <= lines.length; i += 1) {
      const transaction = {
        title: lines[i][0],
        type: lines[i][1],
        value: Number(lines[i][2]),
        category: lines[i][3],
      };
      transactions.push(transaction);
      // eslint-disable-next-line no-await-in-loop
      await transactionService.execute(transaction);
    }
    return transactions;
  }

  private async loadCSV(csvFilePath: string): Promise<string[]> {
    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: string[] = [];

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    return lines;
  }
}

export default ImportTransactionsService;
