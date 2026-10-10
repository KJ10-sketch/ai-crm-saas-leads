export const notFound=(req,res,next)=>next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
export const errorHandler=(err,req,res,next)=>{
 let status=err.statusCode||500,msg=err.message||'Internal server error';
 if(err.name==='CastError'){status=400;msg='Invalid resource id';}
 if(err.code===11000){status=409;msg='A record with that value already exists';}
 if(err.name==='ValidationError'){status=400;msg=Object.values(err.errors).map(e=>e.message).join(', ');}
 if(status>=500) console.error(err);
 res.status(status).json({success:false,message:msg,...(process.env.NODE_ENV==='development'?{stack:err.stack}: {})});
};
