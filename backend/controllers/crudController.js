import Lead from '../models/Lead.js';
import Contact from '../models/Contact.js';
import Note from '../models/Note.js';
import Task from '../models/Task.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const owner = (req) => req.user._id;

/* ------------------------------ Leads ------------------------------ */

export const getLeads = asyncHandler(async (req, res) => {
  const { status, priority, source, search } = req.query;

  const f = {
    owner: owner(req),
    ...(status && { status }),
    ...(priority && { priority }),
    ...(source && { source }),
  };

  if (search) {
    f.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
  }

  const data = await Lead.find(f).sort({ order: 1, createdAt: -1 });

  res.json({ leads: data, count: data.length });
});

export const getLead = asyncHandler(async (req, res) => {
  const x = await Lead.findOne({ _id: req.params.id, owner: owner(req) });

  if (!x) throw new ApiError(404, 'Lead not found');

  res.json({ lead: x });
});

export const createLead = asyncHandler(async (req, res) => {
  const x = await Lead.create({ ...req.body, owner: owner(req) });

  res.status(201).json({ lead: x });
});

export const updateLead = asyncHandler(async (req, res) => {
  const { owner: _ignore, ...updates } = req.body;

  const x = await Lead.findOneAndUpdate(
    { _id: req.params.id, owner: owner(req) },
    updates,
    { new: true, runValidators: true }
  );

  if (!x) throw new ApiError(404, 'Lead not found');

  res.json({ lead: x });
});

export const deleteLead = asyncHandler(async (req, res) => {
  const x = await Lead.findOneAndDelete({
    _id: req.params.id,
    owner: owner(req),
  });

  if (!x) throw new ApiError(404, 'Lead not found');

  res.json({ message: 'Lead deleted' });
});

export const reorderLeads = asyncHandler(async (req, res) => {
  if (!Array.isArray(req.body.updates)) {
    throw new ApiError(400, 'updates must be an array');
  }

  await Promise.all(
    req.body.updates.map((u) =>
      Lead.findOneAndUpdate(
        { _id: u.id, owner: owner(req) },
        { status: u.status, order: u.order },
        { runValidators: true }
      )
    )
  );

  res.json({ message: 'Pipeline order saved' });
});

/* ------------------- Generic CRUD resource factory ------------------- */

const resource = (Model, opts = {}) => ({
  list: asyncHandler(async (req, res) => {
    const f = { owner: owner(req) };

    if (opts.filters) opts.filters(req, f);

    let q = Model.find(f);

    if (opts.populate) {
      for (const p of opts.populate) q = q.populate(p.path, p.select);
    }

    q = q.sort(opts.sort || { createdAt: -1 });

    res.json({ [opts.key || 'items']: await q });
  }),

  get: asyncHandler(async (req, res) => {
    let q = Model.findOne({ _id: req.params.id, owner: owner(req) });

    if (opts.populate) {
      for (const p of opts.populate) q = q.populate(p.path, p.select);
    }

    const x = await q;

    if (!x) throw new ApiError(404, 'Record not found');

    res.json({ [opts.singular || 'item']: x });
  }),

  create: asyncHandler(async (req, res) => {
    const x = await Model.create({ ...req.body, owner: owner(req) });

    res.status(201).json({ [opts.singular || 'item']: x });
  }),

  update: asyncHandler(async (req, res) => {
    const { owner: _ignore, ...u } = req.body;

    if (Model === Task) {
      if (u.status === 'completed' && !u.completedAt) {
        u.completedAt = new Date();
      }
      if (u.status && u.status !== 'completed') {
        u.completedAt = null;
      }
    }

    const x = await Model.findOneAndUpdate(
      { _id: req.params.id, owner: owner(req) },
      u,
      { new: true, runValidators: true }
    );

    if (!x) throw new ApiError(404, 'Record not found');

    res.json({ [opts.singular || 'item']: x });
  }),

  del: asyncHandler(async (req, res) => {
    const x = await Model.findOneAndDelete({
      _id: req.params.id,
      owner: owner(req),
    });

    if (!x) throw new ApiError(404, 'Record not found');

    res.json({ message: 'Deleted' });
  }),
});

/* ------------------------ Resource instances ------------------------ */

export const contacts = resource(Contact, {
  key: 'contacts',
  singular: 'contact',
  sort: { favorite: -1, name: 1 },
  filters: (req, f) => {
    if (req.query.tag) f.tags = req.query.tag;

    if (req.query.search) {
      f.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { company: { $regex: req.query.search, $options: 'i' } },
      ];
    }
  },
});

export const notes = resource(Note, {
  key: 'notes',
  singular: 'note',
  populate: [
    { path: 'lead', select: 'name company' },
    { path: 'contact', select: 'name company' },
  ],
  sort: { pinned: -1, createdAt: -1 },
  filters: (req, f) => {
    if (req.query.lead) f.lead = req.query.lead;
    if (req.query.contact) f.contact = req.query.contact;
    if (req.query.search) {
      f.content = { $regex: req.query.search, $options: 'i' };
    }
  },
});

export const tasks = resource(Task, {
  key: 'tasks',
  singular: 'task',
  populate: [
    { path: 'relatedLead', select: 'name company' },
    { path: 'relatedContact', select: 'name company' },
  ],
  sort: { dueDate: 1 },
  filters: (req, f) => {
    for (const k of ['status', 'priority', 'relatedLead']) {
      if (req.query[k]) f[k] = req.query[k];
    }
  },
});