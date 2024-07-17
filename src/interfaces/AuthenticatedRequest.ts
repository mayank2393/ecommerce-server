import { Request } from "express";

interface AuthenticatedRequest extends Request {
  user: any;
  cookie?: any;
}

export default AuthenticatedRequest;