import express from 'express';
import reservationController from '../controllers/ReservationController';

const router = express.Router();

router.post('/', reservationController.checkAvailability);

export default router;
