import { Request, Response } from 'express';
import Reservation, { IReservation } from '../models/Reservation';
import nodemailer from 'nodemailer';
import { sendEmail } from '../utils/email';

class ReservationController {
    public async checkAvailability(req: Request, res: Response): Promise<void> {
        const { packageName, checkinDate, checkoutDate } = req.body;
    
        try {
          const overlappingReservation = await Reservation.findOne({
            packageName,
            $or: [
              {
                checkinDate: { $lt: checkoutDate },
                checkoutDate: { $gt: checkinDate },
              },
            ],
          });
    
          const isAvailable = !overlappingReservation;
    
          res.json({ isAvailable });
        } catch (error) {
          res.status(500).json({ error: 'Failed to check availability' });
        }
      }

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
          const overlappingReservation = await Reservation.findOne({
            packageName,
            $or: [
              {
                checkinDate: { $lt: checkoutDate },
                checkoutDate: { $gt: checkinDate },
              },
            ],
          });
    
          if (overlappingReservation) {
            res.status(400).json({ error: 'Booking conflict: Package not available for the specified dates' });
            return;
          }
    
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
    
          // Send email notification
      //     const subject2 = 'New Reservation';
      // const html2 = 'New Reservation.';
      // const email2 =  'bookings@ceylonvoyagersretreat.com';
      // await sendEmail(email2, subject2, html2);

      const subject = 'Reservation Confirmation';
      const html = 'Your reservation has been confirmed.';
      await sendEmail(email, subject, html);

      
    
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
