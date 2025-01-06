"use strict";
// src/controllers/storeController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNearbyStores = findNearbyStores;
const axios_1 = __importDefault(require("axios"));
const geolocation_1 = require("../utils/geolocation");
const stores_json_1 = __importDefault(require("../data/stores.json")); // Importando as lojas
function findNearbyStores(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { cep } = req.body;
        try {
            // Obter endereço do CEP
            const viaCepResponse = yield axios_1.default.get(`https://viacep.com.br/ws/${cep}/json/`);
            const userAddress = viaCepResponse.data;
            // Obter coordenadas do endereço do usuário
            const userFullAddress = `${userAddress.logradouro}, ${userAddress.localidade}, ${userAddress.uf}`;
            const userCoordinatesResponse = yield axios_1.default.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: userFullAddress,
                    format: 'json',
                    limit: 1
                },
                headers: {
                    'User-Agent': 'YourAppName'
                }
            });
            const userCoordinates = userCoordinatesResponse.data[0];
            if (!userCoordinates) {
                return res.status(400).json({ message: 'Não foi possível obter as coordenadas do CEP informado.' });
            }
            const userLat = parseFloat(userCoordinates.lat);
            const userLon = parseFloat(userCoordinates.lon);
            // Calcular distância para cada loja
            const nearbyStores = stores_json_1.default
                .map((store) => {
                const distance = (0, geolocation_1.getDistanceFromLatLonInKm)(userLat, userLon, store.coordinates.latitude, store.coordinates.longitude);
                return Object.assign(Object.assign({}, store), { distance });
            })
                .filter((store) => store.distance <= 100)
                .sort((a, b) => a.distance - b.distance);
            if (nearbyStores.length === 0) {
                return res.status(200).json({ message: 'Nenhuma loja encontrada em um raio de 100 km.' });
            }
            return res.status(200).json(nearbyStores);
        }
        catch (error) {
            // Logar o erro
            console.error(error);
            return res.status(500).json({ message: 'Erro ao processar a requisição.' });
        }
    });
}
