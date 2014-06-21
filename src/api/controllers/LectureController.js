/**
 * LectureController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var crypto = require('crypto');

var fs = require('fs');

module.exports = {


  /**
   * Action blueprints:
   *    `/lecture/create`
   */
  create: function (req, res) {
    var key = crypto.randomBytes(24).toString('base64').replace(/\//g, '_').replace(/\+/g, '-') + '.mp3';
    var url = 'https://s3-us-west-2.amazonaws.com/glass-education/'+key;
    s3.putObject({
      ACL : 'public-read',
      Bucket : 'glass-education',
      Key : key,
      ContentType : 'audio/mpeg',
      Body : fs.createReadStream(req.files.audio.path)
    }, function(err, data){
      if(err){
        console.log(err);
        return res.json({
          status: 'err',
          err: err
        });
      }
      else{
        Lecture.create({
          audioUrl: url
        }).done(function(err, lecture){
          if(err)
            return res.json({
              status: 'err',
              err: err
            });

            return res.json(lecture);
        });
      }
    });
  },


  /**
   * Action blueprints:
   *    `/lecture/update`
   */
  update: function (req, res) {

    // Send a JSON response
    return res.json({
      hello: 'world'
    });
  },


  /**
   * Action blueprints:
   *    `/lecture/destroy`
   */
  destroy: function (req, res) {

    // Send a JSON response
    return res.json({
      hello: 'world'
    });
  },


  /**
   * Action blueprints:
   *    `/lecture/add_photo`
   */
  add_photo: function (req, res) {

    // Send a JSON response
    return res.json({
      hello: 'world'
    });
  },

  get: function(req, res){
    Lecture.findOne({id: req.param('id')}).done(function(err, lecture){
      if(err)
        return res.json({
          status: 'err',
          err: err
        });

        return res.json(lecture);
    });
  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to LectureController)
   */
  _config: {}


};