import { db } from "../db";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const registerUser = async (payload: any) => {
  const { name, email, password } = payload;

  // Check if email already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { error: "Email sudah terdaftar" };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return { data: "OK" };
};

export const loginUser = async (payload: any) => {
  const { email, password } = payload;

  if (!email || !password) {
    return { error: "Email dan password wajib diisi" };
  }

  // Find user by email
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    return { error: "Email atau password salah" };
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { error: "Email atau password salah" };
  }

  // Generate token (UUID)
  const token = crypto.randomUUID();

  // Save session
  await db.insert(sessions).values({
    token,
    userId: user.id,
  });

  return { data: token };
};
