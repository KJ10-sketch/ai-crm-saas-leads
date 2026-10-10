import mongoose from 'mongoose';

export const TASK_STATUSES = ['pending', 'in-progress', 'completed'];
export const TASK_PRIORITIES = ['low', 'medium', 'high'];

const schema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: TASK_STATUSES,
      default: 'pending',
      index: true,
    },
    priority: { type: String, enum: TASK_PRIORITIES, default: 'medium' },
    relatedLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      default: null,
    },
    relatedContact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      default: null,
    },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Task', schema);