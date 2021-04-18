// ************************************************

// NEXUS Hub Node Server
//				Jesse Allison (2020)
//
//	To Launch:
//		npm start
//		- or -
//		NODE_ENV=production sudo PORT=80 node nexusNode.js
//		(sudo is required to launch on port 80.)

// ************************************************

// const multer = require('multer') //use multer to upload blob data
// const bodyParser = require('body-parser');
// const upload = multer(); // set multer to be the upload variable (just like express, see above ( include it, then use it/set it up))
// const fs = require('fs'); //use the file system so we can save files

var sio = require('socket.io');
var publicFolder = __dirname + '/public';

var hub = require('./js/hub');
//var hub = new NexusHub();
// let ffmpeg = require('ffmpeg');

// Polyfill for Objects.entries
// FIXME: didn't seem to work on the Heroku server. 
// if (!Object.entries) {
//   Object.entries = function( obj ){
//     var ownProps = Object.keys( obj ),
//         i = ownProps.length,
//         resArray = new Array(i); // preallocate the Array
//     while (i--)
//       resArray[i] = [ownProps[i], obj[ownProps[i]]];
    
//     return resArray;
//   };
// }

// update any server settings before initialization
// Allowes automatic usage on Heroku -- can call npm start with --PORT flag... (find the actual command..:)
if (process.env.PORT) {
  hub.serverPort = process.env.PORT;
} else {
  hub.serverPort = 3000;
}

// var serverPort = process.env.PORT || SERVER_PORT;

hub.init(sio, publicFolder);


// hub.app.use(bodyParser.json());
// hub.app.use(bodyParser.urlencoded({ extended: true }));

// *** adding in audio file upload...
// hub.app.post('/upload', upload.single('soundBlob'), function(req, res, next) {
//   hub.log('upload', req.file); // see what got uploaded
//   let uploadLocation = __dirname + '/public/uploads/' + req.file.originalname + ".wav" // where to save the file to. make sure the incoming name has a .wav extension

//   fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer))); // write the blob to the server as a file
//   res.sendStatus(200); //send back that everything went ok
//   hub.log("Seems to have uploaded...", req.body.id, req.body.user, req.file.originalname);

//   mp3(req.file.originalname);
//   // Could transmit the load sample from here:
//   hub.transmit('sample', null, { 'user': req.body.user, 'val': 'load', 'sample': true, 'url': req.file.originalname + '.mp3', 'id': req.body.id });
// })


// Could spin off into it's own node app or spork a thread.
// function mp3(fileName) {
//   hub.log('MP3: ', fileName);
//   try {
//     let process = new ffmpeg(__dirname + '/public/uploads/' + fileName + ".wav");
//     // console.log('process: ', process);
//     process.then(function(audio) {
//       // callback mode
//       audio.setAudioBitRate(128);
//       // console.log('Audio', audio);
//       audio.fnExtractSoundToMP3(__dirname + '/public/uploads/' + fileName + ".mp3", function(error, file) {
//         if (!error) {
//           hub.log('Audio file: ', file);
//         } else {
//           hub.log('Extraction Error: ', error);
//         }
//       });
//     }, function(err) {
//       hub.log('Error encoding mp3: ', err);
//     })
//   } catch (e) {
//     hub.log('Error: ', e.code);
//     hub.log(e.msg);
//   }
//   // console.log('done mp3');
// };





// *********************
// Set Hub Variables  or add more if you like.

hub.sectionTitles = ['preConcert', 'performance', 'postConcert'];
hub.currentSection = 0;

hub.cues = ['preshow', 'show', 'postshow', 'demo'];
hub.currentCue = 0;
hub.currentSubCue = 0;

hub.hub = {
  id: ""
};
hub.sampler = {
  id: ""
};
hub.discreteClients.hub = {
  id: null
};
hub.discreteClients.sampler = {
  id: null
};

// global states

concertState = {
  section: '0',
  title: 'EMDM Concert',
  twitchChannel: 'lsuemdm_duo'
}

glassState = {
	enabled: true,
	masterFader: 1.0
} 

artworkState = {
  artworks: [],
  staged: false,
  playing: false
}

aerialState = {}


hub.log('Number of sections', hub.sectionTitles.length);


// Respond to web sockets with socket.on
hub.io.sockets.on('connection', function(socket) {
  var ioClientCounter = 0; // Can I move this outside into global vars?
  this.socket = socket;
  this.socketID = socket.id;

  hub.channel('register', null, null, function(data) {
    // TODO: iterate through data and add these properties dynamically.
    // Can add any other pertinent details to the socket to be retrieved later


    socket.username = typeof data.name !== 'undefined' ? data.name : "user"+1234;
    socket.userColor = typeof data.color !== 'undefined' ? data.color : "#CCCCCC";
    socket.userNote = typeof data.note !== 'undefined' ? data.note : " ";
    socket.userLocation = typeof data.location !== 'undefined' ? data.location : { x: 0.5, y: 0.5 };

    // **** Standard client setup ****
    if (socket.username == "display") {
      hub.display.id = socket.id;
      hub.discreteClients.display.id = socket.id;
      hub.log("Hello display: ", hub.display.id);
    } else if (socket.username == "conductor") {
      hub.controller.id = socket.id;
      hub.discreteClients.controller.id = socket.id;
      hub.log("Hello Conductor: ", hub.controller.id);
    } else if (socket.username == "glassPerformer") {
      hub.glassPerformer.id = socket.id;
      hub.discreteClients.glassPerformer.id = socket.id;
      hub.log("Hello Glass Performer: ", hub.glassPerformer.id);
    } else if (socket.username == "kitchenPerformer") {
      hub.kitchenPerformer.id = socket.id;
      hub.discreteClients.kitchenPerformer.id = socket.id;
      hub.log("Hello Kitchen Performer: ", hub.kitchenPerformer.id);
    } else if (socket.username == "aerialPerformer") {
      hub.aerialPerformer.id = socket.id;
      hub.discreteClients.aerialPerformer.id = socket.id;
      hub.log("Hello Aerial Performer: ", hub.aerialPerformer.id);
    } else if (socket.username == "audioController") {
      hub.audio.id = socket.id;
      hub.discreteClients.audio.id = socket.id;
      hub.log("Hello Audio Controller: ", hub.audio.id);
    } else if (socket.username == "maxController") {
      hub.audio.id = socket.id;
      hub.discreteClients.audio.id = socket.id;
      hub.log("Hello MaxMSP Controller: ", hub.max.id);
    } else { // It's a standard user
      hub.ioClients.push(socket.id);
      if (hub.audio.id) {
        hub.io.to(hub.audio.id).emit('/glass/registerUser', { id: socket.id, color: socket.userColor, locationX: socket.userLocation[0], locationY: socket.userLocation[1], note: socket.userNote }, 1);
      }
    }
    
    if (hub.controller.id || hub.hub.id || hub.sampler.id ) {
      if (hub.controller.id == socket.id ) {   // the controller just joined. do we have users already?
        if(hub.registeredUsers.length > 0) {
          Object.entries(hub.registeredUsers).forEach(([number, data])=>{
            hub.io.to(hub.controller.id).emit('welcome', data);
          });
        }
        // hub.intervalTransmit('userList', null, {users: hub.getListOfUsers()}, 30000)
      } else if(hub.controller.id != socket.id) {
        let data = {id: socket.id, username: socket.username, color: socket.userColor, location: socket.userLocation };
        hub.io.to(hub.controller.id).emit('welcome', data); 
        hub.registeredUsers.push(data); 
      }
    }

    socket.emit('glassState', glassState);
    socket.emit('concert', concertState);
    var title = hub.getSection(hub.currentSection);
    socket.emit('setSection', { section: hub.currentSection, title: title })
    socket.emit('setCue', { val: hub.currentCue, name: hub.cues[hub.currentCue], subcue: hub.currentSubCue });
  });

  // Traditional socket assignments work just fine
  socket.on('disconnect', function() {
    // hub.ioClients.remove(socket.id);	// FIXME: Remove client if they leave
    hub.log('SERVER: ', socket.id, ' has left the building');
  });

  //  hub.enableUserTimeout();  // Adds 'checkin' channel
  //  let userList = hub.getListOfUsers();
  //  hub.intervalTransmit('userList', null, {users: hub.getListOfUsers()}, 30000)





  // ******** Concert Admin ********

  hub.channel('concert', null, null, (data) => {
    hub.log('concert', data);
    if(data.getState) {
      socket.emit('concert', concertState);
    }
    if(data.syncAudienceState) {
      socket.broadcast.emit('concert', concertState);
    }
  })

  hub.channel('masterFader', null, null, function(data) {
    // hub.transmit('masterFader', null, data);
    hub.log('masterFader', data);
    if(data.work == 'glass') {
      glassState['masterFader'] = data.val;
    } else if(data.work == 'aerial') {
      aerialState['masterFader'] = data.val;
    } else if(data.work == 'kitchen') {
      kitchenState['masterFader'] = data.val;
    } else {
      concertState['masterFader'] = data.val;
    }
    socket.broadcast.emit('masterFader', data);
  });



  // ****** ArtWorks ********

      // work [name or id], id, stage,play, pause, stop
  hub.channel('artwork', null, null, function(data) {
    // Check that only the Conductor is attempting to use this channel.
    hub.log('artwork', data);
    if (socket.username == 'conductor'){
      if(data.stage == true) {
        artworkState['staged'] = data.work;
        concertState['currentWork'] = data.work;
      } else if(data.stage === false) {
        artworkState['staged'] = false;
        concertState['currentWork'] = false;
      }
      if(data.play == true) {
        artworkState['playing'] = data.work;
      }
      if(data.pause || data.stop) {
        artworkState['playing'] = false;
      }
      if(data.setArtworks) {
        artworkState.artworks = data.setArtworks;
        hub.log('Artworks set to:', artworkState.artworks);
      }
      if(data.setTwitchChannel) {
        concertState['twitchChannel'] = data.channel;
      }
      // socket.broadcast.emit('artwork', data);
      hub.transmit('artwork', null, data);
    }
    if(data.getState) {
      socket.emit('artwork', {state: artworkState});
    }
  });

  hub.channel('stageWork', null, null, (data)=>{
    socket.broadcast.emit('stageWork', data);
    // stageWork(data.work, data.stage)  // Expected values
  })





  // ********* General Concert Commands ********
  // Don't use auto callback creation yet, it's not secure.
  // hub.channel('tap', null, ["others", "display", "audio"]);

  hub.channel('shareColor', null, ["others"], function(data) {
    hub.log('shareColor', data);
    hub.transmit('shareColor', null, data);
  });

  hub.channel('sendText', null, ["others", "display"], function(data) {
    hub.log('sendText', data);
    hub.transmit('sendText', null, data);
  });

  hub.channel('announcement', null, ["others", "display"], function(data) {
    hub.log('announcement', data);
    hub.transmit('announcement', null, data);
  });

  hub.channel('liveWriting', null, ['others'], (data)=> {
    hub.log('liveWriting', data);
    concertState.liveWriting = data.liveWriting;
  })

  hub.channel('questions', null, ["others", "display"], (data)=>{
    hub.log('questions', data)
    if(data.currentQuestion) {
      hub.transmit('questions', null, data);
    }
    if(data.askQuestion) {
      hub.io.to(hub.controller.id).emit('questions', data); 
    }
  })

  hub.channel('section', null, null, function(data) {
    if (data.section == 'next') {
      hub.currentSection += 1;
    } else if (data.section >= 0 && data.section < hub.sectionTitles.length) {
      hub.currentSection = data.section;
    }

    hub.setSection(hub.currentSection);
    hub.log('Section is now:', data.section)
  });


  hub.channel('nearbyLocation', null, null, (data) => {
    hub.transmit('nearbyLocation', ['sampler'], data);
  })

  hub.channel('enable', null, null, (data) => {
    // data.user = "name", .val = record, .enabled = boolean
    // console.log('enable:', data);
    hub.log('enable:', data);
    gravity['enabled'] = data.enabled;
    hub.transmit('enable', null, data);
  });

      // 'val': cue, 'name': cues(cue), 'subcue': subCue 
  hub.channel('cue', null, null, (data) => {
    // console.log('cue:', data);
    hub.log('cue:', data);
    hub.transmit('cue', null, data);
    hub.currentCue = data.val;
    hub.currentSubCue = data.subcue;
  });

		// play{ note: 64}
  hub.channel('play', null, null, (data) => {
    // console.log('cue:', data);
    hub.log('play:', data);
    hub.transmit('play', null, data);
  });

  hub.channel('clearUsers', null, null, (data) => {
    // data.user = "name", .val = record, .enabled = boolean
    // console.log('enable:', data);
    hub.log('clearUsers:', hub.registeredUsers.length);
    hub.registeredUsers = [];
    hub.log('Users', hub.registeredUsers);
  });




  // ***************************************
  // ******* Glass Framework Commands ******

  hub.channel('glass', null, null, (data)=> {
    hub.log('glass: ', data);
    if(socket.id == hub.glassPerformer.id) {    // Main Performer

    } else {
       // from an audience member
    }
  })


  hub.log("On Connect socket id: ", socket.id);
  hub.onConnection(socket);
});



