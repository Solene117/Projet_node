import mongoose, { Document, Schema } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface IReservation extends Document {
  user: mongoose.Types.ObjectId;
  locker: mongoose.Types.ObjectId;
  startDate: Date;
  durationHours: number;
  expiresAt: Date;
  paymentStatus: PaymentStatus;
  paymentSessionId?: string;
  paymentAmount: number;
  paymentDate?: Date;
}

const reservationSchema = new Schema<IReservation>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  locker: { type: Schema.Types.ObjectId, ref: 'Locker', required: true },
  startDate: { type: Date, default: Date.now },
  durationHours: { type: Number, required: true },
  expiresAt: { type: Date, required: true},
  paymentStatus: { 
    type: String, 
    enum: Object.values(PaymentStatus), 
    default: PaymentStatus.PENDING,
    required: true 
  },
  paymentSessionId: { type: String },
  paymentAmount: { type: Number, required: true },
  paymentDate: { type: Date },
});

const Reservation = mongoose.model<IReservation>('Reservation', reservationSchema);

export default Reservation;
