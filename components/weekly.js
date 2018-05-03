var Job = require('./job.js');
var job = new Job();

job.on('done', function(details){
    console.log(details.responseData);
    console.log('Weekly job completed on: ', details.completedOn)
})

job.on('error', function(error) {
    console.log('Error occurred: ' + error)
})

//job.emit('start');
job.postData();