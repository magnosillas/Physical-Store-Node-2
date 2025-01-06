import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import sequelize from './config/database';
import storeRoutes from './routes/storeRoutes';
import logger from './config/winston';
import fs from 'fs';
import path from 'path';


const logDirectory = path.resolve(__dirname, '../../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const app = express();
app.use(express.json());


app.use('/api', storeRoutes);


const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  logger.error(`Erro não tratado: ${err.message}`);
  res.status(500).json({ message: 'Erro interno do servidor.' });
};

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

sequelize
  .sync({ alter: true }) 
  .then(() => {
    logger.info('Conectado ao banco de dados e sincronizado com sucesso.');
    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error: any) => {
    logger.error(`Erro ao sincronizar com o banco de dados: ${error.message}`);
  });
