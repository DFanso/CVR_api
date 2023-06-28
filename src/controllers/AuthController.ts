import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin, { IAdmin } from '../models/Admin';

class AuthController {
  public async register(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    try {
      const existingAdmin = await Admin.findOne({ username });
      if (existingAdmin) {
        res.status(400).json({ error: 'Username already exists' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const admin: IAdmin = new Admin({
        username,
        password: hashedPassword,
      });
      await admin.save();

      res.json({ message: 'Registration successful' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to register admin' });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    try {
      const admin = await Admin.findOne({ username });
      if (!admin) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }

      const passwordMatch = await bcrypt.compare(password, admin.password);
      if (!passwordMatch) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }

      const token = jwt.sign({ username: admin.username }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      });

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Failed to authenticate admin' });
    }
  }
}

export default new AuthController();
