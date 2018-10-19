const shortid = require('shortid');
const appServ = require('./app.service');
const mongoose = require('./app.mongoose');
const appUtil = require('./app.util');

function addUser(req,res,next){
  let userName = req.body.username;
  console.log("Inside addUser method :: ",userName);
  appServ.find(mongoose.USER,{username:userName}).then((recordStatus,err)=>{
        if(err){
         console.error("Error while getting user :: ",err);
          return;
        }
    if(recordStatus){
        return res.send('username already taken');
    }
    if(!recordStatus){
       let user = new mongoose.USER({
          user_id : shortid.generate(),
          username: userName
        });
         appServ.save(user).then((usr,err)=>{
            if(err){
             console.error("Error while saving user :: ",err);
              return;
            }
           return res.json({username: usr.username,_id: usr.user_id});
         }).catch((e)=>{
             console.error("Exception while saving user :: ",e);
             res.status(500).send('Internal Server Error ');
         }); 
    } 
    
  }).catch((e)=>{
       console.error("Exception while getting user :: ",e);
       res.status(500).send('Internal Server Error ');
  });
}

function addExcercise(req,res,next){
  console.log("Inside addExcercise method :: ",req.body);
  let [userId,description,duration,date] = [req.body.userId,req.body.description,req.body.duration,appUtil.formatDate(req.body.date)];

  appServ.find(mongoose.USER,{user_id:userId}).then((user,err)=>{
           if(err) {
            console.error("Error while find User: ",err);
            return;
           }
          if(user){
             if(!description){
               res.send("Path `description` is required.");
               return;
                 }
             else if(duration){
                if(!parseInt(duration,10)){
                  res.send(`Cast to Number failed for value "${req.body.duration}" at path "duration"`);
                  return;
                }
             }
            else  if(!duration){
               res.send("Path `duration` is required.");
                 return;
               }
            else if(!date){
               res.send(`Cast to Date failed for value "${req.body.date}" at path "date"`);
              return;
            }
            
              appServ.update(mongoose.USER,{user_id:userId},{$push:{log:{description:description,duration:duration,date:date}},
                         $inc:{'count':1}}).then((record,err)=>{
                        if(err){
                          console.error("Error while saving an exercise: ",err);
                          return;
                        }
                       let logLen= record.log.length;
                              return res.json({username:record.username,description:record.log[logLen-1].description,
                        duration:record.log[logLen-1].duration,
                        _id:record.user_id,
                        date:appUtil.formatDate(record.log[logLen-1].date)
             });
                return;
   }).catch((e)=>{
       console.error("Exception while saving excercise :: ",e);
       res.status(500).send('Internal Server Error ');
  });
          }
          else{
            res.send("unknown _id");
            return;
          }
    }).catch((e)=>{
       console.error("Exception while saving excercise :: ",e);
       res.status(500).send('Internal Server Error ');
  });
  
  
}

function getExcerciseLog(req,res,next){
  let [userId,from,to,limit] = [req.query.userId,appUtil.formatDate(req.query.from),appUtil.formatDate(req.query.to),req.query.limit];
  let query = {user_id:userId};
  let resJson = {};
  appServ.find(mongoose.USER,query).then((user,err)=>{
     resJson = {_id:user.user_id,username:user.username,count:user.count};
         let filterLogs = user.log.map((log)=>{
           let logToReturn = ({description:log.description,duration:log.duration,date:appUtil.formatDate(log.date)}); 
           if(from && to){
              resJson.from = appUtil.formatDate(from);
              resJson.to = appUtil.formatDate(to);
               if((log.date >= new Date(from) ) && ( log.date <= new Date(to) ))
                    return logToReturn;
           }
           else if(from){
             resJson.from = appUtil.formatDate(from);
             if(log.date >= new Date(from)){
                return logToReturn;
             }
           }
           else if(to){
               resJson.to = appUtil.formatDate(to);
               if(log.date <= new Date(to))
                 return logToReturn;
           }else{
              return logToReturn;
           }
           
         });
           if(limit){
             filterLogs = filterLogs.slice(0,limit);
             resJson.count = filterLogs.length;
           }
    resJson.log = filterLogs;
    return res.json(resJson);
    
  }).catch((e)=>{
       console.error("Exception while getting excercise logs :: ",e);
       res.status(500).send('Internal Server Error ');
  });
  
  console.log("Query from request :: ",userId,from,to,limit);
}



module.exports={addUser,addExcercise,getExcerciseLog};