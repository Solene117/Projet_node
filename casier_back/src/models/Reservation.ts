import mongoose, { Document, Schema } from 'mongoose';

export interface IReservation extends Document {
  user: mongoose.Types.ObjectId;
  locker: mongoose.Types.ObjectId;
  startDate: Date;
  durationHours: number;
  expiresAt: Date;
}

const reservationSchema = new Schema<IReservation>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  locker: { type: Schema.Types.ObjectId, ref: 'Locker', required: true },
  startDate: { type: Date, default: Date.now },
  durationHours: { type: Number, required: true },
  expiresAt: { type: Date, required: true}, 
});

const Reservation = mongoose.model<IReservation>('Reservation', reservationSchema);

export default Reservation;
