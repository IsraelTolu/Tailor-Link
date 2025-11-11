import { register, verifyEmail, login, forgotPassword, resetPassword } from '../services/authService.js';

export async function registerHandler(req, res) {
  try {
    const { role, fullname, phone, email, password } = req.body;
    if (!role || !fullname || !phone || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await register({ role, fullname, phone, email, password });
    return res.status(201).json({ message: 'Registered successfully. Please verify your email.', user: result });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function verifyEmailHandler(req, res) {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Token required' });
    const result = await verifyEmail(token);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function loginHandler(req, res) {
  try {
    const { identifier, password } = req.body; // identifier can be email or phone
    if (!identifier || !password) return res.status(400).json({ error: 'Missing credentials' });
    const result = await login({ identifier, password });
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function forgotPasswordHandler(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    const result = await forgotPassword({ email });
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function resetPasswordHandler(req, res) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: 'Token and newPassword required' });
    const result = await resetPassword({ token, newPassword });
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}