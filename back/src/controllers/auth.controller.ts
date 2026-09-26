import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import { OAuth2Client } from "google-auth-library";

import { User } from "../models/user.model";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
} from "../validators/auth.validator";

import crypto from "crypto";
import { sendResetEmail } from "../config/mailer";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { credential } = req.body;

    if (!credential) {
      res.status(400).json({
        success: false,
        message: "Google access token is required.",
      });
      return;
    }

    // Get Google user information using access token
    const googleResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${credential}`,
        },
      },
    );

    if (!googleResponse.ok) {
      res.status(401).json({
        success: false,
        message: "Invalid Google access token.",
      });
      return;
    }

    const googleUser = await googleResponse.json();

    const { sub: googleId, email, name, email_verified } = googleUser;

    if (!email || !email_verified) {
      res.status(401).json({
        success: false,
        message: "Google email is not verified.",
      });
      return;
    }

    // Find existing user
    let user = await User.findOne({
      $or: [{ googleId }, { email: email.toLowerCase() }],
    });

    // Create new user
    if (!user) {
      user = await User.create({
        name: name || "Google User",
        email: email.toLowerCase(),
        googleId,
        acceptedTerms: true,
        role: "user",
      });
    }

    // Link Google account to existing email account
    else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    // JWT secret
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured.");
    }

    // Create your application JWT
    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      secret,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      success: true,
      message: "Google login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);

    res.status(500).json({
      success: false,
      message: "Google authentication failed.",
    });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const data = registerSchema.parse(req.body);

    // Check existing user
    const existingUser = await User.findOne({
      email: data.email,
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });

      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      acceptedTerms: data.acceptedTerms,
      role: "user",
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({
        success: false,
        message: "Invalid registration data.",
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong during registration.",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body);

    // Find user and include password
    const user = await User.findOne({
      email: data.email,
    }).select("+password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
      return;
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(data.password, user.password);

    if (!passwordMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
      return;
    }

    // Create JWT
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
        name: user.name,
        email: user.email,
      },
      secret,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Invalid login data.",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong during login.",
    });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data = forgotPasswordSchema.parse(req.body);

    const user = await User.findOne({
      email: data.email,
    });

    // Do not reveal whether email exists
    if (!user) {
      res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, we have sent a password reset link.",
      });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;

    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    await sendResetEmail(user.email, resetLink);

    res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, we have sent a password reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({
        success: false,
        message: "Token and password are required.",
      });
      return;
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired reset link.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Your password has been reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};
