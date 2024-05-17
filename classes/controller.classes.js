class DTO {
     constructor() {};
     code = '200';
     result;
     ok = true;
     success = true;
     msg = 'Good';
     msg2 = msg2 || '';
     from = 'send universal';
};

class Controller {
     result = { some: 'Useful data' };
     req = {};
     res = {};

     constructor(_this, conName) {
          this.conName = conName;
          this.result = {};
          this.req = {};
          this.res = {};
     };

     get successDTO() {
          return {
               code: '200',
               result: this.result,
               ok: true,
               success: true,
               msg: 'Good :)',
               msg2: this.successMsg,
               from: 'send Universal'
          };
     };
  
      get unSuccessDTO() {
          return {
               code: '200',
               result: this.result,
               ok: false,
               success: false,
               msg: 'Not good :(',
               msg2: this.unSuccessMsg,
               from: 'send Universal'
          };
     };

     get errorDTO() {
          return {
               code: '500',
               status: '',
               err: this.err?.toString(),
               success: false,
               msg: 'Error in ' + this.req.url,
               msg2: this.errMsg,
               from: 'error Universal'
          };
     };
  
     get errMsg () {
          return `Error! ${this.unSuccessMsg}`;
     };

     async go(req, res) {
          this.req = req;
          this.res = res;
          try {
               await this.do();
               return this.fork();
          } catch (e) {
               this.err = e;
               return this.errorDTO
          };
     };

     fork = _ => this.result.ok ? this.successDTO : this.unSuccessDTO;
};

module.exports = Controller;