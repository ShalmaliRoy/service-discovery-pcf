
function test() {
  this.add({ role: 'test-client', cmd: 'getId' }, function (args, done) {
    this.client = this.client(args.request$.clientUrl.get('role:test'));
    this.act('role:test,cmd:getId', { headers: args.request$.headers, params: args.args.params }, (err, result) => {
      if (result) {
        return done(null, result);
      }
      console.log(err);
      return done(new Error(err.message), null);
    });
  });


  this.add({ role: 'test-client', cmd: 'test' }, function (args, done) {
    this.client = this.client(args.request$.clientUrl.get('role:test'));
    this.act('role:test,cmd:test', (err, result) => {
      if (result) {
        return done(null, result);
      }
      console.log(err);
      return done(new Error(err.message), null);
    });
  });
};
module.exports = test;
