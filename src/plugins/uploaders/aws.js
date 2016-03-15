const AWS = require('aws-sdk'),
  fs = require('fs')
  path = require('path'),
  mime = require('mime');

/**
 * awsUploader class
 * @returns {awsUploader}
 */
function awsUploader() {

  /**
   * awsUploader object
   * @type {awsUploader}
     */
  var object = {};

  /**
   * Load the uploader
   * @param callback
     */
  object.load = function (callback) {
    object.loadAWSConfig();
    callback();
  }

  /**
   * Load AWS Config
   * @todo Load this from preferences of some kind
   */
  object.loadAWSConfig = function () {
    AWS.config.loadFromPath(appRoot + '/config/config.json');
  }

  /**
   * Upload a file
   * @param file
   * @param callback
     */
  object.upload = function (file, callback) {
    var s3 = new AWS.S3({
      params: {
        Bucket: object.getBucket(),
        Key: path.parse(file).base
      }
    });

    s3.upload({
      Body: fs.createReadStream(file),
      ACL: "public-read",
      ContentType: mime.lookup(file)
    }, function (err, data) {
      callback(data.Location);
    });
  }

  /**
   * Get AWS bucket
   * @returns {string}
     */
  object.getBucket = function () {
    return 'sourcebox-screenshots';
  }

  /**
   * Get the plugin name
   * @returns {string}
   */
  object.getName = function () {
    return 'AWS Uploader';
  }

  /**
   * Get the plugin handler
   * @returns {string}
   */
  object.getHandler = function () {
    return 'aws-uploader';
  }

  /**
   * Get uploader icon
   * @returns {string}
   */
  object.getIconName = function() {
    return 'upload';
  }

  return object;
}

/**
 * Export module
 * @type {awsUploader}
 */
module.exports = new awsUploader();