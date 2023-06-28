import mongoose, { Document, Schema } from 'mongoose';

export interface IReservation extends Document {
  packageName: string;
  checkinDate: Date;
  checkoutDate: Date;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

const reservationSchema = new Schema({
  packageName: { type: String, required: true },
  checkinDate: { type: Date, required: true },
  checkoutDate: { type: Date, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
});

export default mongoose.model<IReservation>('Reservation', reservationSchema);
