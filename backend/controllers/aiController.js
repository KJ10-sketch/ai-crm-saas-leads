import Lead from '../models/Lead.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js'; 
  import {
     isAIConfigured,model,
      generateLeadSummary,
     generateEmail,
     generateSalesInsights
   } from '../services/aiService.js';

const resolve=async req=>{
    if(req.body.leadId){
        const x=await Lead.findOne({_id:req.body.leadId,owner:req.user._id});
      if(!x)throw new ApiError(404,'Lead not found');return x;
    }
  if(req.body.lead)return req.body.lead;
  throw new ApiError(400,'A lead or leadId is required');
};

export const status=asyncHandler(async(req,res)=>res.json(
    {configured:isAIConfigured(),
    model:model()
}));

export const summary=asyncHandler(async(req,res)=>{
    const l=await resolve(req),r=await generateLeadSummary(l);
    if(req.body.leadId){l.aiSummary=r.summary;
        l.aiRiskScore=r.riskScore;await l.save();
    }res.json(r);
});

export const email=asyncHandler(
    async(req,res)=>
        res.json
      (await generateEmail(await resolve(req),req.user,req.body.purpose||
      'follow-up',req.body.tone||'professional'))
);

export const insights=asyncHandler(async(req,res)=>
    {
        let stats=req.body.stats;
        if(!stats){
            const leads=await Lead.find({owner:req.user._id});
            stats=buildStats(leads);
        }
        res.json(await generateSalesInsights(stats));
    });
export function buildStats(leads){
    const stages={
        new:{count:0,value:0},
        qualified:{count:0,value:0},
        proposal:{count:0,value:0},
        won:{count:0,value:0},
        lost:{count:0,value:0}
    };
    let pipeline=0,
    won=0;
    for(const l of leads){
        stages[l.status].count++;stages[l.status].value+=l.value||
        0;pipeline+=l.value||0;if(l.status==='won')won+=l.value||0;
    }
    const closed=stages.won.count+stages.lost.count;
    return{
        totalLeads:leads.length,
        totalPipelineValue:pipeline,
        wonValue:won,
        winRate:closed?stages.won.count/closed*100:0,stages
    };
}
