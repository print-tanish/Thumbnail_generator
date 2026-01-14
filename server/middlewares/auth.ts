import { Request, Response, NextFunction } from "express";

const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { isLoggedIn, userId } = req.session;
  console.log("Protect Middleware - SessionID:", req.sessionID);
  console.log("Protect Middleware - UserID:", userId);
  console.log("Protect Middleware - IsLoggedIn:", isLoggedIn);

  if (!isLoggedIn || !userId) {
    return res.status(401).json({
      message: "You are not logged in",
    });
  }

  next();
};

export default protect;
