import mongoose, { Document, Schema } from 'mongoose';

export interface ILocker extends Document {
  number: number;
  size: 'small' | 'medium' | 'large';
  status: 'free' | 'reserved';
  price: number;
}

const lockerSchema = new Schema<ILocker>({
  number: { type: Number, required: true, unique: true },
  size: { type: String, enum: ['small', 'medium', 'large'], required: true },
  status: { type: String, enum: ['free', 'reserved'], default: 'free' },
  price: { type: Number, required: true },
});

const Locker = mongoose.model<ILocker>('Locker', lockerSchema);

export default Locker;
