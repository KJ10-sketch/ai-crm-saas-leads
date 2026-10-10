import mongoose from 'mongoose';

export const LEAD_STATUSES = ['new', 'qualified', 'proposal', 'won', 'lost'];
export const LEAD_PRIORITIES = ['low', 'medium', 'high'];

const schema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, default: '' },
    company: { type: String, default: '' },
    phone: { type: String, default: '' },
    status: { type: String, enum: LEAD_STATUSES, default: 'new', index: true },
    priority: { type: String, enum: LEAD_PRIORITIES, default: 'medium' },
    source: { type: String, default: 'Other' },
    value: { type: Number, min: 0, default: 0 },
    notes: { type: String, default: '' },
    order: { type: Number, default: 0 },
    aiSummary: { type: String, default: '' },
    aiRiskScore: { type: Number, min: 0, max: 100, null: true },
  },
  { timestamps: true }
);

export default mongoose.model('Lead', schema);