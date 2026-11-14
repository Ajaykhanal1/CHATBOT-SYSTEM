import mongoose, { Document, Schema } from "mongoose";

export type PaymentProvider = "esewa" | "khalti";
export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "cancelled"
  | "expired";

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  reference: string;
  planId: "pro" | "business";
  planName: string;
  provider: PaymentProvider;
  status: PaymentStatus;

  amountUsd: number;
  exchangeRate: number;
  rateDate: string;
  rateSource: string;
  rateFallback: boolean;
  amountNpr: number;
  currency: "NPR";

  providerRef?: string;
  providerTxnId?: string;
  paidAt?: Date;
  accessStartsAt?: Date;
  accessEndsAt?: Date;
  failureReason?: string;
  rawResponse?: unknown;
  expiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    reference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    planId: {
      type: String,
      enum: ["pro", "business"],
      required: true,
    },

    planName: {
      type: String,
      required: true,
    },

    provider: {
      type: String,
      enum: ["esewa", "khalti"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled", "expired"],
      default: "pending",
      required: true,
      index: true,
    },

    amountUsd: { type: Number, required: true },
    exchangeRate: { type: Number, required: true },
    rateDate: { type: String, required: true },
    rateSource: { type: String, required: true },
    rateFallback: { type: Boolean, default: false },
    amountNpr: { type: Number, required: true },
    currency: { type: String, enum: ["NPR"], default: "NPR" },

    providerRef: { type: String, index: true },
    providerTxnId: { type: String },
    paidAt: { type: Date },
    accessStartsAt: { type: Date },
    accessEndsAt: { type: Date, index: true },
    failureReason: { type: String },
    rawResponse: { type: Schema.Types.Mixed },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

paymentSchema.index({ userId: 1, status: 1, accessEndsAt: -1 });

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
