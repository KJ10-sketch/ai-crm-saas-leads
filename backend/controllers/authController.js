import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const safe = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  company: u.company,
  avatar: u.avatar,
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, company } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email and password are required');
  }

  if (await User.findOne({ email })) {
    throw new ApiError(409, 'Email is already registered');
  }

  const u = await User.create({ name, email, password, company });

  res.status(201).json({ token: generateToken(u._id), user: safe(u) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const u = await User.findOne({ email }).select('+password');

  if (!u || !(await u.matchPassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  res.json({ token: generateToken(u._id), user: safe(u) });
});

export const me = asyncHandler(async (req, res) =>
  res.json({ user: safe(req.user) })
);

export const updateProfile = asyncHandler(async (req, res) => {
  const u = req.user;

  for (const k of ['name', 'company', 'avatar']) {
    if (req.body[k] !== undefined) u[k] = req.body[k];
  }

  if (req.body.password) u.password = req.body.password;

  await u.save();

  res.json({ user: safe(u) });
});