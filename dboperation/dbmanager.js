
const AWS = require('aws-sdk');
const uuid = require('node-uuid')
const dynamodb = require('dynamodb')
var docClient = new AWS.DynamoDB.DocumentClient();

module.exports.getUser = (params) => {
    // console.log("fetchind data in", params);
    return new Promise((resolve, reject) => {
      docClient.get(params, (err, data) => {
      // console.log('From db: Data ' + JSON.stringify(data) + ' error : ' + err)
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

module.exports.addItem = (params) => {
    console.log("Adding a new item...", params);
    return new Promise((resolve, reject) => {
      docClient.put(params, (err, data) => {
      // console.log('From db: Data ' + JSON.stringify(data) + ' error : ' + err)
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

module.exports.updateItem = (params) => {
    console.log("Adding a new item...", params);
    return new Promise((resolve, reject) => {
      docClient.update(params, (err, data) => {
      // console.log('From db: Data ' + JSON.stringify(data) + ' error : ' + err)
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

module.exports.deleteItem = (params) => {
    console.log("Deleting item ", params);
    return new Promise((resolve, reject) => {
      docClient.delete(params, (err, data) => {
      // console.log('From db: Data ' + JSON.stringify(data) + ' error : ' + err)
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
