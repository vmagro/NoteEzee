/**
 * NoteController
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

module.exports = {
    
  
  /**
   * Action blueprints:
   *    `/note/destroy`
   */
   destroy: function (req, res) {
    Note.destroy({
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
   *    `/note/update`
   */
   update: function (req, res) {
    Note.findOne({id: req.param('id')}).done(function(err, note){
      if(err){
        return res.json({
          status: 'err',
          err: err
        });
      }

      if(req.body.title)
        note.title = req.body.title;

      note.save(function(err, note){
        if(err){
          return res.json({
            status: 'err',
            err: err
          });
        }
        return res.json(note);
      });
    });
  },




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to NoteController)
   */
  _config: {}

  
};
