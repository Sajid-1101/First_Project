module.exports = (fn)=>{
    return function(req,res,next){
        fn(req,res,next).catch(next);
        //.catch(err)=>{
        // next(err)
        // } same as catch(next)
    }
}