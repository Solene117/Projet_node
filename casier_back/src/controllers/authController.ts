import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { User, UserRole } from '../models/User';
import { EmailService } from '../services/email.service';
 
/**
 * Génère un JWT token contenant l'ID de l'utilisateur
 * @param userId - L'ID de l'utilisateur à inclure dans le token
 * @returns Le token JWT signé
 */
const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'default-secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ userId }, secret, { expiresIn } as SignOptions);
};

/**
 * Inscription d'un nouvel utilisateur
 * @route POST /api/auth/register
 * @param req.body.email - Email de l'utilisateur
 * @param req.body.password - Mot de passe de l'utilisateur
 * @param req.body.firstName - Prénom de l'utilisateur
 * @param req.body.lastName - Nom de l'utilisateur
 * @returns {Object} Message de succès et token JWT
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: UserRole.USER
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      message: 'Inscription réussie',
      token
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
  }
};

/**
 * Connexion d'un utilisateur
 * @route POST /api/auth/login
 * @param req.body.email - Email de l'utilisateur
 * @param req.body.password - Mot de passe de l'utilisateur
 * @returns {Object} Message de succès et token JWT
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = generateToken(user._id.toString());

    res.json({
      message: 'Connexion réussie',
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
};

/**
 * Demande de réinitialisation de mot de passe
 * @route POST /api/auth/forgot-password
 * @param req.body.email - Email de l'utilisateur
 * @returns {Object} Message de confirmation
 * @description Génère un token de réinitialisation valide 20 minutes et l'envoie par email
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Aucun compte associé à cet email' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes

    await user.save();

    // Construction de l'URL de réinitialisation
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const emailService = new EmailService();
    const emailContent = {
        to: user.email,
        subject: 'Réinitialisation de votre mot de passe',
        text: `Réinitialisez votre mot de passe en cliquant sur ce lien : ${resetUrl}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #333; text-align: center;">Réinitialisation de votre mot de passe</h1>
                <p style="color: #666;">Vous avez demandé une réinitialisation de mot de passe.</p>
                <p style="color: #666;">Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="background-color: #4CAF50; 
                              color: white; 
                              padding: 12px 24px; 
                              text-decoration: none; 
                              border-radius: 4px; 
                              display: inline-block;">
                        Réinitialiser mon mot de passe
                    </a>
                </div>
                <p style="color: #666;">Ce lien est valable pendant 20 minutes.</p>
                <p style="color: #999; font-size: 0.9em;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
                <p style="color: #999; font-size: 0.8em;">Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                <span style="color: #0066cc;">${resetUrl}</span></p>
            </div>
        `
    }

    if (!await emailService.sendEmail(emailContent)) {
      return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email de réinitialisation' });
    }

    res.json({ 
      message: 'Instructions de réinitialisation envoyées par email',
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email de réinitialisation' });
  }
};

/**
 * Réinitialisation du mot de passe avec le token
 * @route POST /api/auth/reset-password
 * @param req.body.token - Token de réinitialisation reçu par email
 * @param req.body.password - Nouveau mot de passe
 * @returns {Object} Message de succès et nouveau token JWT
 * @description Vérifie le token de réinitialisation et met à jour le mot de passe
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token invalide ou expiré' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const newToken = generateToken(user._id.toString());

    res.json({
      message: 'Mot de passe réinitialisé avec succès',
      token: newToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
  }
};

export const infosUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Non autorisé" });
      return;
    }
    res.status(200).json({
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Déconnexion d'un utilisateur
 * @route POST /api/auth/logout
 * @returns {Object} Message de confirmation
 * @description Côté serveur, on ne peut pas vraiment "expirer" un JWT existant,
 * mais on peut conseiller au client de supprimer le token
 */
export const logout = async (req: Request, res: Response) => {
  try {
    res.json({
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la déconnexion' });
  }
};
