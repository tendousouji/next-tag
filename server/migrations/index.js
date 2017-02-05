import async from 'async';
import kernel from '../app';

//TODO - custom args
//let args = process.argv.slice(2);
async.waterfall([
  (cb) => {
    require('./user')(kernel.model.User, cb);
  }
], (err) => {
  if (err) {
    console.log('Migrate error', err);
  }

  console.log('migrate data done...');
  process.exit();
});
