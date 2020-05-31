'use strict';

const uuid = require('node-uuid')
const dbOp = require('./dboperation/dbmanager')

const response = {
  statusCode: 200,
  body: {
      message: 'UserId ',
      input: ''
    }
};

module.exports.hello = (event, content, callback) => {
  const TableName = `${process.env.PREFIX}LFMC.FSOSettings`
  const ROLE = `${process.env.ROLE}`
  console.log('Table name ', TableName + ' Role ' + ROLE)
  let userId = uuid.v4();
  console.log('Userid is ', userId)
  return callback (null, {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event
      }
    )
  })

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

// module.exports.auth = (event, content, callback) => {
//   const data = JSON.parse(event.body)
//   const userId = data.UserId
//   const password = data.Password
//   console.log('Userid is ' + userId + '\nPassword is ' + password)
  
//   return callback (null, {
//     statusCode: 200,
//     body: JSON.stringify(
//       {
//         message: 'Go Serverless v1.0! Your function executed successfully!',
//         input: event
//       }
//     )
//   })

//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
// };

module.exports.addUser = (event, content, callback) => {
  const userId = uuid.v4();
  const data = JSON.parse(event.body)
  // console.log('Parsed data ', data)
  const email = data.Email
  const firstName = data.FirstName
  const lastName = data.LastName
  const password = data.Password
  const table = 'lambda-services-dev-user'
  var params = {
    TableName:table,
    Item:{
        "userId": userId,
        "Email": email,
        "FirstName": firstName,
        "LastName": lastName,
        "Password": password,         
      }
    };
  console.log('params')
  dbOp.addItem(params)
   .then(data => {
     console.log(data)
      response.body.message= response.body.message + userId
      response.body.input = data
      // response.body = JSON.stringify(response.body)
      console.log("response ", response)
      
      return callback(null, response)
   })
  
  
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.getUser = (event, content, callback) => {
  const data = JSON.parse(event.body)
  console.log('event ', event)
  const userId = event.pathParameters.uid
  console.log('User id is ', userId)
  const table = 'lambda-services-dev-user'
  var params = {
    TableName:table,
    Key:{
        "userId": userId,
      }
    };
  dbOp.getUser(params)
   .then(data => {
    //  console.log('recieved data \n',data)
      response.body.message= response.body.message + userId
      response.body.input = data
      response.body = JSON.stringify(response.body)
      console.log("response ", response)
      
      return callback(null, response)
   })
};

module.exports.editUser = (event, content, callback) => {
  const data = JSON.parse(event.body)
  const userId = event.pathParameters.uid
  // console.log('Parsed data ', data)
  const email = data.Email
  const firstName = data.FirstName
  const lastName = data.LastName
  const password = data.Password
  const table = 'lambda-services-dev-user'
  var params = {
    TableName:table,
    Key:{
      "userId": userId,
    },
    UpdateExpression: "set Email=:e, FirstName=:f, LastName=:l, Password=:p",
    ExpressionAttributeValues:{
      ":e":email,
      ":f": firstName,
      ":l": lastName,
      ":p": password
    },
    ReturnValues: 'UPDATED_NEW'
    }
  
  dbOp.updateItem(params)
   .then(data => {
    //  console.log(data)
      response.body.message= response.body.message + userId
      response.body.input = data
      response.body = JSON.stringify(response.body)
      return callback(null, response)
   })
};

module.exports.deleteUser = (event, content, callback) => {
  const data = JSON.parse(event.body)
  const userId = event.pathParameters.uid
  // console.log('Parsed data ', data)
  const table = 'lambda-services-dev-user'
  var params = {
    TableName:table,
    Key:{
      "userId": userId,
    }
    }
  
  dbOp.deleteItem(params)
   .then(data => {
    //  console.log(data)
      response.body.message= response.body.message + userId
      response.body.input = data
      response.body = JSON.stringify(response.body)
      return callback(null, response)
   })
};