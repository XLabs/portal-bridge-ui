import { Router } from 'express'
import availableMarkets from 'routes/markets/available-markets';

const router = Router();

router.get('/', availableMarkets);

export default router;