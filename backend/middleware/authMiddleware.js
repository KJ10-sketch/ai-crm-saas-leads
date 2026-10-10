import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js';
export const protect=asyncHandler(async(req,res,next)=>{
 const header=req.headers.authorization||'';
 if(!header.startsWith('Bearer ')) throw new ApiError(401,'Not authorized, no token provided');
 try{
  const decoded=jwt.verify(header.slice(7),process.env.JWT_SECRET);
  const user=await User.findById(decoded.id);
  if(!user) throw new ApiError(401,'User account no longer exists');
  req.user=user; next();
 }catch(e){if(e instanceof ApiError) throw e; throw new ApiError(401,'Not authorized, invalid or expired token');}
});
