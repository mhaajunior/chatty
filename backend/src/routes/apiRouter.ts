import { Router, Request, Response } from "express";
import authRoutes from "./auth.route";
import messageRoutes from "./message.route";

const apiRouter = Router();

// รวบรวม route group ทั้งหมด
apiRouter.use("/auth", authRoutes); // /api/auth
apiRouter.use("/messages", messageRoutes); // /api/message

apiRouter.get("/health", (req: Request, res: Response) => {
  res.send(`Server Up! on ${process.env.INSTANCE_NAME}`);
});

export default apiRouter;
