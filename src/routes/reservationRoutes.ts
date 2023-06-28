import express from 'express';
import reservationController from '../controllers/ReservationController';

const router = express.Router();

router.post('/', reservationController.create);
router.get('/', reservationController.getAll);
router.get('/:id', reservationController.getById);
router.put('/:id', reservationController.update);
router.delete('/:id', reservationController.delete);

export default router;
