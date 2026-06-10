import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import menuRouter from "./menu";
import ordersRouter from "./orders";
import paymentRouter from "./payment";
import couponsRouter from "./coupons";
import usersRouter from "./users";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(menuRouter);
router.use(ordersRouter);
router.use(paymentRouter);
router.use(couponsRouter);
router.use(usersRouter);
router.use(dashboardRouter);

export default router;
