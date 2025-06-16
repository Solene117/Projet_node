import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'user' | 'admin';
  resetToken?: string;
  resetTokenExpiration?: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  resetToken: String,
  resetTokenExpiration: Date,
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
