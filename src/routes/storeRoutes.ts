import { Router } from 'express';
import { createStore, getStores, getStoreById, updateStore, deleteStore, findNearbyStores } from '../controllers/storeController';

const router = Router();

router.post('/stores', createStore);
router.get('/stores', getStores);
router.get('/stores/:id', getStoreById);
router.put('/stores/:id', updateStore);
router.delete('/stores/:id', deleteStore);
router.get('/stores/nearby/:cep', findNearbyStores);

export default router;
