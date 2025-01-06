"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const storeRoutes_1 = __importDefault(require("./routes/storeRoutes"));
const winston_1 = __importDefault(require("./config/winston"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/', storeRoutes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    winston_1.default.info(`Servidor iniciado na porta ${PORT}`);
});
