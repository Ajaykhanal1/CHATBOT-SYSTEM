import { Router } from "express";

import {
  failEsewaPayment,
  getPaymentAccess,
  getQuote,
  initiatePayment,
  verifyEsewaPayment,
  verifyKhaltiPayment,
} from "../controllers/paymentController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/access", getPaymentAccess);
router.get("/quote", getQuote);
router.post("/initiate", initiatePayment);
router.post("/esewa/verify", verifyEsewaPayment);
router.post("/esewa/failure", failEsewaPayment);
router.post("/khalti/verify", verifyKhaltiPayment);

export default router;
