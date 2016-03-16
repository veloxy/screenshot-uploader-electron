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
   * Base plugin
   */
  var basePlugin = new (require(appRoot + '/assets/js/basePlugin.js'))();

  /**
   * awsUploader object
   * @type {awsUploader}
     */
  var object = basePlugin;

  var config = {};

  /**
   * Load the uploader
   * @param callback
     */
  object.load = function (callback) {
    config = object.getConfig();
    object.loadAWSConfig();
    callback();
  }

  /**
   * Load AWS Config
   */
  object.loadAWSConfig = function () {
    AWS.config.update({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region
    });
  }

  /**
   * Upload a file
   * @param file
   * @param callback
     */
  object.upload = function (file, callback) {
    var s3 = new AWS.S3({
      params: {
        Bucket: config.bucket,
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
    return 'aws';
  }

  /**
   * Get uploader icon
   * @returns {string}
   */
  object.getIconName = function () {
    return 'upload';
  }

  /**
   * Get config fields
   * @returns {string[]}
     */
  object.getConfigFields = function () {
    return [
      'accessKeyId',
      'secretAccessKey',
      'bucket',
      'region'
    ];
  }

  return object;
}

/**
 * Export module
 * @type {awsUploader}
 */
module.exports = new awsUploader();