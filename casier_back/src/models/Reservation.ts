import mongoose, { Document, Schema } from 'mongoose';

export interface IReservation extends Document {
  user: mongoose.Types.ObjectId;
  locker: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  durationHours: number;
  status: 'active' | 'expired';
}

const reservationSchema = new Schema<IReservation>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  locker: { type: Schema.Types.ObjectId, ref: 'Locker', required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  durationHours: { type: Number, required: true },
  status: { type: String, enum: ['active', 'expired'], default: 'active' },
});

const Reservation = mongoose.model<IReservation>('Reservation', reservationSchema);

export default Reservation;
