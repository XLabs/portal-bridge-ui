import { Router } from 'express';
import markets from 'routes/markets';

const router = Router();

router.use('/markets', markets);

export default router;