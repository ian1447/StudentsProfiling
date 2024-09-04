import { Router } from 'express';
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js';
import * as enrolledsubCtrl from '../controllers/enrolledsubjects.js';

const router = Router();

/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken);
router.get('/', checkAuth, enrolledsubCtrl.getEnrolledSubjects);
// router.get('/:id', checkAuth, usersCtrl.getUser);
router.post('/', checkAuth, enrolledsubCtrl.createEnrolledSubjects);
router.put('/:id', checkAuth, enrolledsubCtrl.updateEnrolledSubjects);
router.delete('/:id', checkAuth, enrolledsubCtrl.deleteEnrolledSubjects);

export { router as enrolledsubjectsRouter };
