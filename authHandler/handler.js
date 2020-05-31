const jwt = require('jsonwebtoken')
const AWS = require('aws-sdk')

const encryptedSecret = process.env['TOKEN_SECRET']
let decryptedSecret

var generatePolicy = function (decodedToken, methodArn) {
  'use strict'
  var tmp = methodArn.split(':'),
    apiGatewayArnTmp = tmp[5].split('/'),
    awsAccountId = tmp[4],
    region = tmp[3],
    restApiId = apiGatewayArnTmp[0],
    stage = apiGatewayArnTmp[1]

  return {
    'userId': decodedToken.userId,
    'context': decodedToken,
    'policyDocument': {
      'Version': '2012-10-17',
      'Statement': [{
        'Effect': 'Allow',
        'Action': [
          'execute-api:Invoke'
        ],
        'Resource': [
          'arn:aws:execute-api:' + region + ':' + awsAccountId + ':' + restApiId + '/' + stage + '/*/*'
        ]
      }]
    }
  }
}

exports.validate = function (event, context, callback) {
  if (decryptedSecret) {
    processEvent(event, context, callback)
  } else {
    // The first time this function is called, we need to decrypt the TOKEN_SECRET env var
    const kms = new AWS.KMS()
    kms.decrypt({ CiphertextBlob: new Buffer(encryptedSecret, 'base64') }, (err, data) => {
      if (err) {
        console.log('Decrypt error:', err)
        return callback('Token cannot be verified - error with KMS')
      }
      decryptedSecret = data.Plaintext.toString('ascii')
      processEvent(event, context, callback)
    })
  }
}

const processEvent = function (event, context, callback) {
  if (event && event.authorizationToken && event.methodArn) {
    const token = event.authorizationToken.replace('Bearer ', '')
    try {
      const decodedToken = jwt.verify(token, new Buffer(decryptedSecret, 'base64'))
      return callback(null, generatePolicy(decodedToken, event.methodArn))
    } catch (err) {
      return callback('Unauthorized')
    }
  } else {
    callback('Unauthorized')
  }
}