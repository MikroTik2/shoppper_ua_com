const { NewPostService } = require('../services/new-post.service');
const Controller = require('../classes/controller.classes');

class TrackingNewPostControllerGet extends Controller {
     constructor(req, res) {
          super(req, res);
          this.newPostService = new NewPostService();
     }

     async do(query) {
          this.conName = 'TrackingNewPostController';
          this.successMsg = 'TrackingNewPost';
          this.unSuccessMsg = 'Cannot get TrackingNewPost';
          
          try {
               this.result = await this.newPostService.getCity(query.query);
               return this.result;
          } catch (error) {
               console.error('Error in tracking controller:', error);
               throw error;
          };
     };

     async de(query) {
          this.conName = 'TrackingNewPostController';
          this.successMsg = 'TrackingNewPost';
          this.unSuccessMsg = 'Cannot get TrackingNewPost';
          
          try {
               this.result = await this.newPostService.getDepartament(query.query);
               return this.result;
          } catch (error) {
               console.error('Error in tracking controller:', error);
               throw error;
          }; 
     }
};

module.exports = { TrackingNewPostControllerGet };