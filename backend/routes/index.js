import { Router } from 'express';
import { register, login, me, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  reorderLeads,
  contacts,
  notes,
  tasks,
} from '../controllers/crudController.js';
import { status, summary, email, insights } from '../controllers/aiController.js';
import { overview } from '../controllers/analyticsController.js';

const r = Router();

const crud = (c) => {
  r.get(c.path, protect, c.list);
  r.post(c.path, protect, c.create);
  r.get(`${c.path}/:id`, protect, c.get);
  r.put(`${c.path}/:id`, protect, c.update);
  r.delete(`${c.path}/:id`, protect, c.del);
};

// Auth
r.post('/auth/register', register);
r.post('/auth/login', login);
r.get('/auth/me', protect, me);
r.put('/auth/profile', protect, updateProfile);

// Leads
r.get('/leads', protect, getLeads);
r.post('/leads', protect, createLead);
r.patch('/leads/reorder', protect, reorderLeads);
r.get('/leads/:id', protect, getLead);
r.put('/leads/:id', protect, updateLead);
r.delete('/leads/:id', protect, deleteLead);

// Contacts, notes, tasks
crud({ path: '/contacts', ...contacts });
crud({ path: '/notes', ...notes });
crud({ path: '/tasks', ...tasks });

// AI
r.get('/ai/status', protect, status);
r.post('/ai/lead-summary', protect, summary);
r.post('/ai/generate-email', protect, email);
r.post('/ai/sales-insights', protect, insights);

// Analytics
r.get('/analytics/overview', protect, overview);

export default r;