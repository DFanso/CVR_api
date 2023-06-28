import { Request, Response } from 'express';
import Reservation, { IReservation } from '../models/Reservation';

class ReservationController {
  public async create(req: Request, res: Response): Promise<void> {
    const {
      packageName,
      checkinDate,
      checkoutDate,
      firstName,
      lastName,
      phoneNumber,
      email,
    } = req.body;

    try {
      const reservation: IReservation = new Reservation({
        packageName,
        checkinDate,
        checkoutDate,
        firstName,
        lastName,
        phoneNumber,
        email,
      });
      await reservation.save();

      res.json({ message: 'Reservation created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create reservation' });
    }
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const reservations = await Reservation.find();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve reservations' });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const reservation = await Reservation.findById(id);
      if (!reservation) {
        res.status(404).json({ error: 'Reservation not found' });
        return;
      }
      res.json(reservation);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve reservation' });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const {
      packageName,
      checkinDate,
      checkoutDate,
      firstName,
      lastName,
      phoneNumber,
      email,
    } = req.body;
    try {
      const reservation = await Reservation.findByIdAndUpdate(
        id,
        {
          packageName,
          checkinDate,
          checkoutDate,
          firstName,
          lastName,
          phoneNumber,
          email,
        },
        { new: true }
      );
      if (!reservation) {
        res.status(404).json({ error: 'Reservation not found' });
        return;
      }
      res.json(reservation);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update reservation' });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const reservation = await Reservation.findByIdAndRemove(id);
      if (!reservation) {
        res.status(404).json({ error: 'Reservation not found' });
        return;
      }
      res.json({ message: 'Reservation deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete reservation' });
    }
  }
}

export default new ReservationController();