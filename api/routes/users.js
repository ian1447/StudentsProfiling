import { Router } from 'express';
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js';
import * as usersCtrl from '../controllers/users.js';

const router = Router();

/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken);
router.get('/', checkAuth, usersCtrl.getUsers);
router.get('/:id', checkAuth, usersCtrl.getUser);
router.post('/', checkAuth, usersCtrl.createUser);
router.put('/:id', checkAuth, usersCtrl.updateUser);
router.delete('/:id', checkAuth, usersCtrl.deleteUser);

export { router as usersRouter };
