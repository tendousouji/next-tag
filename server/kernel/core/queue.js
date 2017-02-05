import kue from 'kue';

exports.config = {
  QUEUE_NAME: 'mean',
  QUEUE_CONFIG: {
    prefix: 'q',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 0,
      options: {}
    }
  }
};

exports.core = (kernel) => {
  let queue = kue.createQueue(kernel.config.QUEUE_CONFIG);

  queue.on('job enqueue', (id, type) => {
    //TODO - hide/remove me in the production mode
    console.log( 'Job %s got queued of type %s', id, type );
  }).on('job complete', (id, result) => {
    //after job is completed, remove the key, we dont need it anymore
    kue.Job.get(id, (err, job) => {
      if (err) { return; }

      job.remove(function(err){
        if (err) { throw err; }
        console.log('removed completed job #%d', job.id);
      });
    });
  });

  //https://github.com/LewisJEllis/bee-queue
  kernel.queue = queue;
};