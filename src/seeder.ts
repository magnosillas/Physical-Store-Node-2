// src/seeder.ts

import sequelize from './config/database';
import Store from './models/store';
import logger from './config/winston';
import axios from 'axios';


interface StoreData {
  name: string;
  contact: string;
  cep: string;
  number: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}


const ceps: string[] = [
  "01001000",
  "05424020",
  "04252010",
  "04002002",
  "04001000",
  "20010010",
  "10010010",
  "20020010",
  "05001000",
  "40020010",
  "06003000",
  "60010010",
  "08002000",
  "09001000",
  "50010010",
  "55040000", 
  "55050000",
 
];


const generateStoreNumber = (index: number): string => {
  return (100 + index).toString();
};


const generateStoreName = (cep: string): string => {
  return `Loja ${cep}`;
};


const generateContact = (): string => {
  const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
  return `(11) ${randomNumber.toString().substring(0,5)}-${randomNumber.toString().substring(5)}`;
};


const seedStores = async () => {
  try {
    
    await sequelize.sync();

    for (let i = 0; i < ceps.length; i++) {
      const originalCep = ceps[i];
      
      
      const sanitizedCep = originalCep.replace(/\D/g, '');

   
      const cepRegex = /^\d{8}$/;
      if (!cepRegex.test(sanitizedCep)) {
        logger.warn(`Formato de CEP inválido: ${originalCep}. Pulando...`);
        continue; 
      }

   
      const storeNumber = generateStoreNumber(i);
      const storeName = generateStoreName(sanitizedCep);
      const contact = generateContact();

      
      const existingStore = await Store.findOne({ where: { cep: sanitizedCep, number: storeNumber } });
      if (existingStore) {
        logger.warn(`Loja já existente com CEP ${sanitizedCep} e número ${storeNumber}. Pulando...`);
        continue; 
      }

     
      const viaCepResponse = await axios.get(`https://viacep.com.br/ws/${sanitizedCep}/json/`);
      const addressData = viaCepResponse.data;

      if (addressData.erro) {
        logger.warn(`CEP inválido fornecido: ${sanitizedCep}. Pulando...`);
        continue;
      }

      const { logradouro, bairro, localidade, uf } = addressData;

  
      const awesomeApiResponse = await axios.get(`https://cep.awesomeapi.com.br/json/${sanitizedCep}`);
      const locationData = awesomeApiResponse.data;

      logger.info(`Dados recebidos da AwesomeAPI para CEP ${sanitizedCep}: ${JSON.stringify(locationData)}`);

      if (!locationData.lat || !locationData.lng) {
        logger.warn(`Coordenadas não encontradas para o CEP fornecido: ${sanitizedCep}. Pulando...`);
        continue; 
      }

      const latitude = parseFloat(locationData.lat);
      const longitude = parseFloat(locationData.lng);


      const store = await Store.create({
        name: storeName,
        contact: contact,
        cep: sanitizedCep,
        number: storeNumber,
        street: logradouro,
        neighborhood: bairro,
        city: localidade,
        state: uf,
        latitude: latitude,
        longitude: longitude,
      });

      logger.info(`Loja criada com sucesso: ${store.name} (CEP: ${sanitizedCep}, Número: ${storeNumber})`);
    }

    logger.info('Seeding concluído com sucesso.');
  } catch (error: any) {
    logger.error(`Erro durante o seeding: ${error.message}`);
  } finally {
    
    await sequelize.close();
  }
};

// Executar o seeder
seedStores();
