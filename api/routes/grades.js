import { Router } from 'express';
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js';
import * as gradesCtrl from '../controllers/grades.js';

const router = Router();

/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken);
router.get('/', checkAuth, gradesCtrl.getGrades);
// router.get('/:id', checkAuth, usersCtrl.getUser);
router.post('/', checkAuth, gradesCtrl.createGrades);
router.put('/:id', checkAuth, gradesCtrl.updateGrades);
router.delete('/:id', checkAuth, gradesCtrl.deleteGrades);

export { router as gradesRouter };
