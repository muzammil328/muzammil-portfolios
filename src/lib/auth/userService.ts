import { connectMongo } from '@/lib/mongodb';
import { UserModel } from '@/models/User';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  type RegisterInput,
  type LoginInput,
  type UpdateProfileInput,
} from '@/lib/auth/authSchema';
import { hashPassword, verifyPassword, validatePasswordStrength } from '@/lib/auth/passwordUtils';
import { generateToken } from '@/lib/auth/tokenUtils';

function mapUserResponse(user: any) {
  return {
    id: user._id?.toString() || '',
    name: user.name,
    email: user.email,
    role: user.role,
    features: user.features,
    is_active: user.is_active,
    created_at: user.created_at,
  };
}

export async function registerUser(payload: unknown) {
  const parsed = registerSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Validation failed');
  }

  const { name, email, password } = parsed.data;

  const strengthCheck = validatePasswordStrength(password);
  if (!strengthCheck.valid) {
    throw new Error(strengthCheck.message || 'Password does not meet requirements');
  }

  await connectMongo();

  const existing = await UserModel.findOne({ email }).lean();
  if (existing) {
    throw new Error('Email address already registered');
  }

  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();

  const user = await UserModel.create({
    name,
    email,
    password_hash: passwordHash,
    role: 'user',
    features: [],
    is_active: true,
    created_at: now,
    updated_at: now,
  });

  const token = await generateToken(user.toObject());
  return {
    token,
    user: mapUserResponse(user),
  };
}

export async function loginUser(payload: unknown) {
  const parsed = loginSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Validation failed');
  }

  const { email, password } = parsed.data;

  await connectMongo();

  const user = await UserModel.findOne({ email }).lean();
  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.is_active) {
    throw new Error('Account is inactive');
  }

  const passwordValid = await verifyPassword(password, user.password_hash);
  if (!passwordValid) {
    throw new Error('Invalid email or password');
  }

  const userDoc = await UserModel.findById(user._id);
  if (!userDoc) {
    throw new Error('User not found');
  }

  const token = await generateToken(userDoc.toObject());
  return {
    token,
    user: mapUserResponse(user),
  };
}

export async function getUserById(userId: string) {
  await connectMongo();

  const user = await UserModel.findById(userId).lean();
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.is_active) {
    throw new Error('Account is inactive');
  }

  return mapUserResponse(user);
}

export async function updateUserProfile(userId: string, payload: unknown) {
  const parsed = updateProfileSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Validation failed');
  }

  await connectMongo();

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.is_active) {
    throw new Error('Account is inactive');
  }

  const update: any = { updated_at: new Date().toISOString() };

  if (parsed.data.name !== undefined) {
    update.name = parsed.data.name;
  }

  if (parsed.data.email !== undefined) {
    const existing = await UserModel.findOne({
      email: parsed.data.email,
      _id: { $ne: userId },
    }).lean();
    if (existing) {
      throw new Error('Email address is already in use');
    }
    update.email = parsed.data.email;
  }

  const updated = await UserModel.findByIdAndUpdate(userId, { $set: update }, { new: true }).lean();

  if (!updated) {
    throw new Error('Failed to update profile');
  }

  return mapUserResponse(updated);
}
