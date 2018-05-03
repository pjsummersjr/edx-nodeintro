var Job = require('./job.js');
var job = new Job();

job.on('done', function(details){
    console.log(details.htmlData);
    console.log('Weekly job completed on: ', details.completedOn)
})

job.emit('start');