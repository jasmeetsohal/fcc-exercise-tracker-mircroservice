const mongoose = require('./app.mongoose');
const shortid = require('shortid');

function find(SCHEMA,query){
   return new Promise((resolve,reject)=>{
     SCHEMA.findOne(query,(err,record)=>{
     if(err) return reject(err);
     if(record) return resolve(record);
     else return resolve(false);
     });
   });
}


function save(data){
 return new Promise((resolve,reject)=>{
   data.save((err,record)=>{
     if(err) return reject(err);
     return resolve(record);
   });
 });
}

function update(SCHEMA,searchQuery,updateQuery){
  return new Promise((resolve,reject) => {
    SCHEMA.findOneAndUpdate(searchQuery,updateQuery,{new:true},(err,record)=>{
         if(err) return reject(err);
         return resolve(record);
    });
  });
}


function findAndUpdate(SCHEMA,searchQuery,updateQuery){
  return new Promise((resolve,reject)=>{
  
  SCHEMA.findOneAndUpdate(searchQuery,updateQuery,{new:true},(err,record)=>{
      if(err) return reject(err);
      return resolve(record);
  
  });
    
  });

  
}


module.exports = {find,save,update,findAndUpdate};