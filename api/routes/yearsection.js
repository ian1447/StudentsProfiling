import { Router } from 'express';
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js';
import * as yearsectionCtrl from '../controllers/yearsection.js';

const router = Router();

/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken);
router.get('/', checkAuth, yearsectionCtrl.getYearSection);
// router.get('/:id', checkAuth, usersCtrl.getUser);
router.post('/', checkAuth, yearsectionCtrl.createYearSection);
router.put('/:id', checkAuth, yearsectionCtrl.updateYearSection);
router.delete('/:id', checkAuth, yearsectionCtrl.deleteYearSection);

export { router as yearsectionsRouter };
