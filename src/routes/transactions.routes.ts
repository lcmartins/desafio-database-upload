import { Router } from 'express';

import multer from 'multer';
import uploadConfig from '../config/upload';
import CreateTransactionService from '../services/CreateTransactionService';
import ListAllTransactionsService from '../services/ListAllTransactionsService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const listAllTransactionsService = new ListAllTransactionsService();
  const transactions = await listAllTransactionsService.getAll();
  return response.status(200).send(transactions);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const transaction = {
    title,
    value,
    type,
    category,
  };

  const createTransactionService = new CreateTransactionService();
  const transactionCreated = await createTransactionService.execute(
    transaction,
  );
  delete transactionCreated.category_id;
  return response.status(201).send(transactionCreated);
});

transactionsRouter.delete('/:id', async (request, response) => {
  await new DeleteTransactionService().execute(request.params.id);
  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const transactions = await new ImportTransactionsService().execute(
      request.file.filename,
    );
    return response.status(200).send(transactions);
  },
);

export default transactionsRouter;
