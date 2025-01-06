"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const storeController_1 = require("../controllers/storeController");
const router = (0, express_1.Router)();
router.post('/stores/nearby', storeController_1.findNearbyStores);
exports.default = router;
