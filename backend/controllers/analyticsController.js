import Lead from '../models/Lead.js';
import Contact from '../models/Contact.js';
import Task from '../models/Task.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const overview = asyncHandler(async (req, res) => {
  const owner = req.user._id;

  const [leads, contactsCount, openTasks] = await Promise.all([
    Lead.find({ owner }),
    Contact.countDocuments({ owner }),
    Task.countDocuments({ owner, status: { $ne: 'completed' } }),
  ]);

  // Pipeline stages
  const stages = {
    new: { count: 0, value: 0 },
    qualified: { count: 0, value: 0 },
    proposal: { count: 0, value: 0 },
    won: { count: 0, value: 0 },
    lost: { count: 0, value: 0 },
  };

  let pipeline = 0;
  let wonValue = 0;

  for (const l of leads) {
    stages[l.status].count++;
    stages[l.status].value += l.value || 0;
    pipeline += l.value || 0;

    if (l.status === 'won') wonValue += l.value || 0;
  }

  const closed = stages.won.count + stages.lost.count;
  const winRate = closed ? (stages.won.count / closed) * 100 : 0;

  // Last 6 months trend
  const months = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleString('en', { month: 'short' }),
      leads: 0,
      wonValue: 0,
    });
  }

  for (const l of leads) {
    const d = new Date(l.createdAt);
    const idx = months.findIndex(
      (m) => m.key === `${d.getFullYear()}-${d.getMonth()}`
    );

    if (idx >= 0) {
      months[idx].leads++;
      if (l.status === 'won') months[idx].wonValue += l.value || 0;
    }
  }

  // Most recently updated leads
  const recent = [...leads]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 6)
    .map((l) => ({
      id: l._id,
      name: l.name,
      company: l.company,
      status: l.status,
      value: l.value,
      updatedAt: l.updatedAt,
    }));

  res.json({
    stats: {
      totalLeads: leads.length,
      contacts: contactsCount,
      openTasks,
      totalPipelineValue: pipeline,
      wonValue,
      winRate,
    },
    pipeline: stages,
    trend: months,
    recentLeads: recent,
  });
});