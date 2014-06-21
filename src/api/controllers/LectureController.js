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

var async = require('async');

module.exports = {


  /**
   * Action blueprints:
   *    `/lecture/create`
   */
  create: function (req, res) {
    uploadFile(req.files.audio, 'audio/mp3', function(err, url){
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
    Lecture.findOne({
      id: req.param('id')
    }).done(function(err, lecture){
      if(req.body.name)
        lecture.name = req.body.name;
      lecture.save(function(err){
        if(err)
          return res.json({
            status: 'err',
            err: err
          });
          return res.json(lecture);
      });
    });
  },

  /**
   * Action blueprints:
   *    `/lecture/destroy`
   */
  destroy: function (req, res) {
    Lecture.destroy({
      id: req.param('id')
    }).done(function(err){
      if(err)
        return res.json({
          status: 'err',
          err: err
        });
        else return res.json({
          status: 'success'
        });
    });
  },


  /**
   * Action blueprints:
   *    `/lecture/add_photo`
   */
  add_photo: function (req, res) {
    Lecture.findOne({id: req.param('id')}).done(function(err, lecture){
      if(err){
        return res.json({
          status: 'err',
          err: err
        });
      }

      console.log('adding note to lecture '+lecture.id);

      uploadFile(req.files.photo, 'image/jpeg', function(err, url){
        if(err){
          return res.json({
            status: 'err',
            err: err
          });
        }

        Note.create({
          imageUrl: url,
          audioTime: req.body.timeStamp
        }).done(function(err, note){
          if(!lecture.notes)
            lecture.notes = [];

          lecture.notes.push(note.id);
          console.log(lecture);

          lecture.save(function(err){
            console.log('save callback');
            if(err){
              return res.json({
                status: 'err',
                err: err
              });
            }

            return res.json(note);
          });
        });
      });

    });
  },

  get: function(req, res){
    console.log('lecture#get');
    Lecture.findOne({id: req.param('id')}).done(function(err, lecture){
      if(err){
        return res.json({
          status: 'err',
          err: err
        });
      }

      var notesIds = lecture.notes;
      lecture.notes = [];
      async.mapSeries(notesIds, function(id, callback){
        Note.findOne({id: id}).done(function(err, note){
          callback(err, note);
          console.log(note);
        });
      }, function(err, notes){
        lecture.notes = notes;
        return res.json(lecture);
      });
    });
  },

  view: function(req, res){
    console.log('lecture#get');
    Lecture.findOne({id: req.param('id')}).done(function(err, lecture){
      if(err){
        return res.json({
          status: 'err',
          err: err
        });
      }

      var notesIds = lecture.notes;
      lecture.notes = [];
      async.mapSeries(notesIds, function(id, callback){
        Note.findOne({id: id}).done(function(err, note){
          callback(err, note);
          console.log(note);
        });
      }, function(err, notes){
        lecture.notes = notes;
        return res.view({title: lecture.name, lecture: lecture});
      });
    });
  },

  index: function(req, res){
    Lecture.find().done(function(err, lectures){
      if(err){
        return res.json({
          statuus: 'err',
          err: err
        });
      }

      return res.view({title: 'Lectures', lectures: lectures});
    });
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to LectureController)
   */
  _config: {}


};

function uploadFile(file, mime, callback){
  var path = file.path;
  var key = crypto.randomBytes(24).toString('base64').replace(/\//g, '_').replace(/\+/g, '-') + path.substring(path.lastIndexOf('.'));
    var url = 'https://s3-us-west-2.amazonaws.com/glass-education/'+key;
  s3.putObject({
    ACL : 'public-read',
    Bucket : 'glass-education',
    Key : key,
    ContentType : mime,
    Body : fs.createReadStream(path)
  }, function(err, data){
    if(err)
      callback(err);
    else
      callback(null, url);
  });
}
