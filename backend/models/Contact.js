import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    title: { type: String, default: '' },
    tags: { type: [String], default: [] },
    notes: { type: String, default: '' },
    favorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

schema.index({ name: 'text', email: 'text', company: 'text' });

export default mongoose.model('Contact', schema);