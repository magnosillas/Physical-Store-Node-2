

import { RequestHandler } from 'express';
import Store from '../models/store';
import logger from '../config/winston';
import axios from 'axios';
import { getDistanceFromLatLonInKm } from '../utils/geolocation';

export const createStore: RequestHandler = async (req, res, next) => {
  try {
    const { name, contact, cep, number } = req.body;

    

    if (!name || !contact || !cep || !number) {
      logger.warn('Dados incompletos fornecidos para criação de loja.');
      return res.status(400).json({ message: 'Nome, contato, CEP e número são obrigatórios.' });
    }

    if (!name || !contact || !cep || !number) {
      logger.warn('Dados incompletos fornecidos para criação de loja.');
      return res.status(400).json({ message: 'Nome, contato, CEP e número são obrigatórios.' });
    }

    const existingStore = await Store.findOne({ where: { cep, number } });
    if (existingStore) {
      logger.warn(`Loja já existente com CEP ${cep} e número ${number}.`);
      return res.status(409).json({ message: 'Já existe uma loja com esse CEP e número.' });
    }

    const sanitizedCep = cep.replace(/\D/g, '');


    const viaCepResponse = await axios.get(`https://viacep.com.br/ws/${sanitizedCep}/json/`);
    const addressData = viaCepResponse.data;

    if (addressData.erro) {
      logger.warn(`CEP inválido fornecido: ${sanitizedCep}`);
      return res.status(400).json({ message: 'CEP inválido.' });
    }

    const { logradouro, bairro, localidade, uf } = addressData;


    const awesomeApiResponse = await axios.get(`https://cep.awesomeapi.com.br/json/${sanitizedCep}`);
    const locationData = awesomeApiResponse.data;

    logger.info(`Dados recebidos da AwesomeAPI para CEP ${sanitizedCep}: ${JSON.stringify(locationData)}`);

    if (!locationData.lat || !locationData.lng) {
      logger.warn(`Coordenadas não encontradas para o CEP fornecido: ${sanitizedCep}`);
      return res.status(400).json({ message: 'Não foi possível obter as coordenadas para o CEP fornecido.' });
    }

    const latitude = parseFloat(locationData.lat);
    const longitude = parseFloat(locationData.lng);


    const store = await Store.create({
      name,
      contact,
      sanitizedCep,
      street: logradouro,
      number,
      neighborhood: bairro,
      city: localidade,
      state: uf,
      latitude,
      longitude,
    });

    logger.info(`Loja criada com sucesso: ${store.id}`);
    return res.status(201).json(store);
  } catch (error: any) {
    logger.error(`Erro ao criar loja: ${error.message}`);
    return next(error);
  }
};


export const getStores: RequestHandler = async (req, res, next) => {
  try {
    const stores = await Store.findAll();
    res.status(200).json(stores);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar lojas: ${error.message}`);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    } else {
      logger.error(`Erro desconhecido ao buscar lojas: ${JSON.stringify(error)}`);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
    next(error);
  }
};

export const getStoreById: RequestHandler = async (req, res, next) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Loja não encontrada.' });
    }
    res.status(200).json(store);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar loja: ${error.message}`);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    } else {
      logger.error(`Erro desconhecido ao buscar loja: ${JSON.stringify(error)}`);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
    next(error);
  }
};

export const updateStore: RequestHandler = async (req, res, next) => {
  try {
    const { name, contact, cep, number } = req.body;

    const store = await Store.findByPk(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Loja não encontrada.' });
    }
    const sanitizedCep = cep.replace(/\D/g, '');

    if (name) store.name = name;
    if (contact) store.contact = contact;
    if (cep) store.cep = sanitizedCep;
    if (number) store.number = number;

    if (sanitizedCep) {

      const viaCepResponse = await axios.get(`https://viacep.com.br/ws/${sanitizedCep}/json/`);
      const addressData = viaCepResponse.data;

      if (addressData.erro) {
        return res.status(400).json({ message: 'CEP inválido.' });
      }

      const { logradouro, bairro, localidade, uf } = addressData;

    
      const awesomeApiResponse = await axios.get(`https://cep.awesomeapi.com.br/json/${sanitizedCep}`);
      const locationData = awesomeApiResponse.data;

      if (!locationData.lat || !locationData.lng) {
        return res.status(400).json({ message: 'Não foi possível obter as coordenadas para o CEP fornecido.' });
      }

      store.street = logradouro;
      store.neighborhood = bairro;
      store.city = localidade;
      store.state = uf;
      store.latitude = parseFloat(locationData.lat);
      store.longitude = parseFloat(locationData.lng);
    }

    await store.save();
    res.status(200).json(store);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao atualizar loja: ${error.message}`);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    } else {
      logger.error(`Erro desconhecido ao atualizar loja: ${JSON.stringify(error)}`);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
    next(error);
  }
};

export const deleteStore: RequestHandler = async (req, res, next) => {
  try {
    const deleted = await Store.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Loja não encontrada.' });
    }
    res.status(200).json({ message: 'Loja excluída com sucesso.' });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao deletar loja: ${error.message}`);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    } else {
      logger.error(`Erro desconhecido ao deletar loja: ${JSON.stringify(error)}`);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
    next(error);
  }
};

export const findNearbyStores: RequestHandler = async (req, res, next) => {
  const { cep } = req.params;

  if (!cep) {
    return res.status(400).json({ message: 'CEP é obrigatório para busca de lojas próximas.' });
  }

  const sanitizedCep = cep.replace(/\D/g, '');

  try {

    const awesomeApiResponse = await axios.get(`https://cep.awesomeapi.com.br/json/${sanitizedCep}`);
    const locationData = awesomeApiResponse.data;

    if (!locationData.lat || !locationData.lng) {
      return res.status(400).json({ message: 'Não foi possível obter as coordenadas para o CEP fornecido.' });
    }

    const userLat = parseFloat(locationData.lat);
    const userLon = parseFloat(locationData.lng);

    const stores = await Store.findAll();
    const nearbyStores = stores
      .map(store => ({
        ...store.get(),
        distance: getDistanceFromLatLonInKm(userLat, userLon, store.latitude, store.longitude),
      }))
      .filter(store => store.distance <= 100)
      .sort((a, b) => a.distance - b.distance);

    if (nearbyStores.length === 0) {
      return res.status(200).json({ message: 'Nenhuma loja encontrada em um raio de 100 km.' });
    }

    res.status(200).json(nearbyStores);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar lojas por CEP: ${error.message}`);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    } else {
      logger.error(`Erro desconhecido ao buscar lojas por CEP: ${JSON.stringify(error)}`);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
    next(error);
  }
};
