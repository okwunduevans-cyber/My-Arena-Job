import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'deepfx_super_secret_production_key';

export class AuthService {
  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async generateToken(userId: string, role: string) {
    return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '30d' });
  }
}
