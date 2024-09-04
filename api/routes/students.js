import { Router } from 'express';
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js';
import * as studentsCtrl from '../controllers/students.js';

const router = Router();

/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken);
router.get('/', checkAuth, studentsCtrl.getStudents);
// router.get('/:id', checkAuth, usersCtrl.getUser);
router.post('/', checkAuth, studentsCtrl.createStudent);
router.put('/:id', checkAuth, studentsCtrl.updateStudents);
router.delete('/:id', checkAuth, studentsCtrl.deleteStudent);

export { router as studentsRouter };
