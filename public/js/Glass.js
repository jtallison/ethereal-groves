class Glass {

  constructor(ctx) {

    // Bind functions with this.
    this.freq = this.freq.bind(this);
    this.playPitch = this.playPitch.bind(this);
    this.playRandomPitch = this.playRandomPitch.bind(this);
    this.triggerPitch = this.triggerPitch.bind(this);
    this.playFirstSound = this.playFirstSound.bind(this);
    this.triggerFirstSound = this.triggerFirstSound.bind(this);
    this.playSecondSound = this.playSecondSound.bind(this);
    this.playRegion = this.playRegion.bind(this);
    this.playLoop = this.playLoop.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.hasLoop = this.hasLoop.bind(this);
    this.masterGain = this.masterGain.bind(this);
    this.playbackRate = this.playbackRate.bind(this);

    this.loadTwitchStream = this.loadTwitchStream.bind(this);
    this.stream;

    this.keysDown = [];
    this.keyList = [];
    this.currentWork = "";
    this.addKeyCommands = this.addKeyCommands.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.keyRelease = this.keyRelease.bind(this);
    this.removeKeyCommands = this.removeKeyCommands.bind(this);
    this.addEditingKeyCommands = this.addEditingKeyCommands.bind(this);
    this.editingKeyPress = this.editingKeyPress.bind(this);
    this.editingKeyRelease = this.editingKeyRelease.bind(this);
    this.editingMouseDown = this.editingMouseDown.bind(this);
    this.editingMouseUp = this.editingMouseUp.bind(this);
    this.editingMouseMove = this.editingMouseMove.bind(this);
    this.editMode = this.editMode.bind(this);
    this.editing = false;
    this.prevMouse = {};

    this.loadVideos = this.loadVideos.bind(this);
    this.playVideo = this.playVideo.bind(this);
    this.toggleVideo = this.toggleVideo.bind(this);
    this.pauseVideo = this.pauseVideo.bind(this);
    this.getVideoDiv = this.getVideoDiv.bind(this);
    this.getVideoInfo = this.getVideoInfo.bind(this);
    this.getSound = this.getSound.bind(this);
    this.isVideoPlaying = this.isVideoPlaying.bind(this);
    
    this.glassPlayers = {'glass': {}};  // glass: players by keyid

    this.playlist = {
      title: 'default',
      prefix: 'default',
      path: '/media/',
      videos: {}
    };

    // this.mediaPath = 'https://emdm-c4te-f2020.storage.googleapis.com/media/'; 
    this.mediaPath = 'https://emdm-lols-2020.storage.googleapis.com/media/'; 

    if(ctx || Hub.ctx) {
      // use context in setting up tone...
      // ctx ? Tone.setContext(ctx) : Tone.setContext(NexusHub.ctx);
    }
    this.context = hub.ctx;
    // Tone.setContext(this.context);
    // this.tone = new Tone();

    this.audio;


    this.region;
    this.pastRegionDrag = {};

    this.sampleLength = 5;    // in seconds

    
    // Effects and Synths

    this.gain = new Tone.Gain({gain:1.0}).toDestination();

    this.tremolo = new Tone.Tremolo({
      "frequency": 8,
      "type": "sine",
      "depth": 0.6,
      "spread": 0
      //"wet": 0.8
    }).connect(this.gain).start();

    this.feedbackDelay = new Tone.FeedbackDelay("8n", 0.3).connect(this.tremolo);

    this.synth = new Tone.Synth({
      "oscillator": {
        "type": "sine"
      },
      "envelope": {
        "attack": 2.0,
        "decay": 0.5,
        "sustain": 0.8,
        "release": 2.0
      }
    }).connect(this.feedbackDelay);

    this.synth.volume.value = -15;

    // Players

    this.player = [];
    this.player[0] = new Tone.Player("/media/E-bass-Small.mp3").toDestination();
    this.player[1] = new Tone.Player("/media/E-bass-Small.mp3").toDestination();
    this.player[0].volume.value = -18;
    this.player[1].volume.value = -10;

    Tone.Transport.start();

    this.pitchCollection = [55, 57, 59, 61, 62, 64, 66, 67, 68, 69, 71, 73, 75, 76, 78, 80, 82, 83];

    this.pitch = this.pitchCollection[Math.floor(Math.random() * (this.pitchCollection.length))];
    console.log("Pitch & Length:", this.pitch, this.pitchCollection.length);
    
    this.videoDiv;
    this.vidAudioNodes = {};
    this.vidGains = {};
  };

  //  CONSTRUCTOR Complete //


  masterGain(val) {
    this.gain.gain.rampTo(val, 0.015);
  };

  playbackRate(val) {
    this.wavesurfer.setPlaybackRate(val);
  }

  freq (midi) {
    var note = Tone.mtof(midi);
    // console.log("Midi: ", midi, note)
    return note;
  };

  // **** Playing Notes **** //
  playPitch(pitch) {
    if (pitch) {
      this.synth.triggerAttackRelease(this.freq(pitch), 0.5);
    } else {
      this.synth.triggerAttackRelease(this.freq(this.pitch), 5);

    }
  };
  
  playRandomPitch() {
    var pitch = this.pitchCollection[Math.floor(Math.random() * (this.pitchCollection.length))];
    this.synth.triggerAttackRelease(this.freq(pitch), 0.5);
  };

  triggerPitch() {
    this.synth.triggerAttackRelease(this.freq(this.pitch), 5);
    hub.send('triggerPitch', {
      'pitch': this.pitch
    });
  };

  playFirstSound() {
    this.player[0].start();
  };

  triggerFirstSound() {
    this.playPitch();
    this.player[0].start();
    // this.seqRandomize();
    hub.send('triggerFirstSound', {
      'pitch': this.pitch
    });
  };

  playSecondSound() {
    this.player[1].start();
    // var pitch = this.pitchCollection[Math.floor(Math.random() * (this.pitchCollection.length))];
    // this.synth.triggerAttackRelease(this.freq(pitch), 5);
    this.playRandomPitch();
  };

  play(){
    if(this.isPlaying()) {
      }

  }
  
  playRegion(currentSample) {
    if(this.isPlaying()) {

    }
  };

  playLoop() {
    if (this.hasLoop()) {
      if(this.isPlaying()) {

      }
    } else {
      console.log('No loop 1');
    }
  }

  pause() {

  }

  hasLoop() {
    return true
  }

  isPlaying() {
		// check if video is playing?
    return false
  }

  // ******* Glass Video Initialization

  loadVideos(playlist, videoDivID, externalGainNode) {
    if(this.keyList) {
      this.keyList.forEach(key => {
        let video = this.getVideoDiv(key)
        video.pause();
        video.removeAttribute('src');
        video.load();
      })
      this.keyList = [];
    }

    if(playlist) {
      this.playlist = playlist;
    }
    if(!this.playlist.prefix) {
      this.playlist.prefix = 'glass';
    }
    if(!this.playlist.path) {
      this.playlist.path = '/media/';
    }
    this.glassPlayers[this.playlist.prefix] = {};
    // Maybe this should create its own div if not provided.
    videoDivID ? this.videoDiv = document.getElementById(videoDivID) : this.videoDiv = document.getElementById('video-bank');
    
      // id: created from prefix and letter
      //    key: created from key
      //    file: must be entered
      //    size: {x: '32%', y:'18%'},
      //    location: left as block instead of absolute positioning
      //    sound: '',
      //    text: '',
      //    clickable: false,
      //    fadeIn: 0.2,
      //    fadeOut: 1,
      //    type: 'sustain'
    let videos = this.playlist.videos;
    this.currentWork = this.playlist.prefix;
    for (let vid in videos) {
      videos[vid].key = vid;
      if (!videos[vid].id) {
        videos[vid].id = this.playlist.prefix+vid;
      }
        // Do we have a video to load? or some other media
      if(videos[vid].file) {
        let x = this.getVideoDiv(vid);  // check to see if it already exists... if so, use it!
        if(!x){
          x = document.createElement("VIDEO");
          x.classList.add('video');
        }
        x.setAttribute('id', videos[vid].id)
        x.setAttribute('crossOrigin', "anonymous");
        
  			// x.style.visibility = 'invisible';
  			if (x.canPlayType("video/webm")) {
  			  x.setAttribute("src",this.playlist.path + videos[vid].file);
  			} else if (x.canPlayType("video/mp4")) {
          x.setAttribute("src",this.playlist.path + videos[vid].file);
  			}
        if(!videos[vid].size) {
          videos[vid].size = {x:'32', y:'18'};
          videos[vid].aspect = videos[vid].size.x/videos[vid].size.y;
        }
  			videos[vid].size.x ? x.style.width = `${videos[vid].size.x}%` : null;
        videos[vid].size.y ? x.style.height = `${videos[vid].size.y}%` : null;
        videos[vid].aspect = videos[vid].size.x/videos[vid].size.y;
        // console.log(videos[vid].size.x, videos[vid].size.y)
  			// x.setAttribute("width", `${videos[vid].size.x}%`)
        // x.setAttribute("height", `${videos[vid].size.y}%`)
        if (!videos[vid].location){
          // default is to leave it block and let it get arranged...
          // These values are in percentages
          videos[vid].location = {x:0, y:0};
          x.style.position = 'relative';
          x.style.left = `${videos[vid].location.x - (videos[vid].size.x * 0.5)}%`;
          x.style.top = `${videos[vid].location.y - (videos[vid].size.y * 0.5)}%`;
        } else {
          x.style.position = 'absolute';
          x.style.left = `${videos[vid].location.x - (videos[vid].size.x * 0.5)}%`;
          x.style.top = `${videos[vid].location.y - (videos[vid].size.y * 0.5)}%`;
        }
        console.log(`left ${videos[vid].location.x - (videos[vid].size.x * 0.5)}%, top: ${videos[vid].location.y - (videos[vid].size.y * 0.5)}%`)
  			if (x.hasAttribute("controls")) {
  		     x.removeAttribute("controls")   
        }
        
        if(!videos[vid].type) {
          videos[vid].type = 'sustain';
          x.setAttribute('loop', true);
        } else if (videos[vid].type == 'loop' || videos[vid].type == 'sustain'){
          x.setAttribute('loop', true)
        } else if (videos[vid].type == 'one-shot'){
          x.onended = (event) => {
            event.target.classList.remove('glass-video-in')
          }
        }

        if(videos[vid].fadeIn == null){   // allows fadeIn = 0
          videos[vid].fadeIn = 0.2;
        }
        x.style.setProperty('--fade-in', `${videos[vid].fadeIn}s`);
        if(videos[vid].fadeOut == null){
          videos[vid].fadeOut = 1.0;
        } 
        x.style.setProperty('--fade-out', `${videos[vid].fadeOut}s`);
        
        if(!videos[vid].clickable){
          videos[vid].clickable = false;
        }
        if(videos[vid].clickable){
    			x.onclick = function() {
    				console.log (this)
    				if (this.paused) {
              // this.classList.remove('fadeOut');
              // this.classList.add('fadeIn');
              this.classList.add('glass-video-in')
    					this.play();
    				} else {
              // this.classList.remove('fadeIn');
              // this.classList.add('fadeOut');
              this.classList.remove('glass-video-in')
    					setTimeout(()=>{this.pause()}, videos[vid].fadeOut * 1000);
    				}
          }
        }
        console.log("almost loaded", videos[vid], x);
        if (x.parentElement != this.videoDiv) {   // If it hasn't been added before, add it and create audio nodes
          this.videoDiv.appendChild(x);
            // Run audio through Tone
          this.vidAudioNodes[videos[vid].id] = Tone.context.rawContext.createMediaElementSource(x);
          if(externalGainNode){
            this.vidGains[videos[vid].id] = new Tone.Gain({gain:0.0}).connect(externalGainNode);
          } else {
            this.vidGains[videos[vid].id] = new Tone.Gain({gain:0.0}).connect(this.gain);
          }
            // console.log('vidNode: ', this.vidAudioNodes[videos[vid].id]);
            // console.log('vidGains: ', this.vidGains[videos[vid].id]);
          this.vidAudioNodes[videos[vid].id].connect(this.vidGains[videos[vid].id].input);
        }
        console.log(videos[vid].id);

      } else {  // empty div keeps things from breaking in searches.
        let x = document.createElement("VIDEO");
        x.classList.add('no-display');
        x.setAttribute('id', videos[vid].id);
        x.setAttribute('novideo', true);
        this.videoDiv.appendChild(x);
      }
      if(videos[vid].sound){
        // Create a Tone buffer and attach for playback!!!
        if(externalGainNode){
          this.glassPlayers[this.playlist.prefix][vid] = new Tone.Player(this.playlist.path + videos[vid].sound).connect(externalGainNode);
        } else {
          this.glassPlayers[this.playlist.prefix][vid] = new Tone.Player(this.playlist.path + videos[vid].sound).connect(this.gain);
        }
        if (videos[vid].type == 'loop' || videos[vid].type == 'sustain') {
          this.glassPlayers[this.playlist.prefix][vid].loop = true;
          this.glassPlayers[this.playlist.prefix][vid].volume.value = -64;

        }

      }
    }
  }

  loadTwitchStream(streamDiv) {
    if(!streamDiv) {
      streamDiv = "twitch-stream";
    }
    // check size of window and set to screen size. or can we resize on enlarging?
    let streamWidth, streamHeight = '100%';
        // Scaled to the div size...
    // if (work.div.clientWidth<400) {
    //   streamWidth = 400;
    //   streamHeight = 300;
    // }
    streamWidth = window.innerWidth
    streamHeight = window.innerWidth * 0.5625;
    let options = {
      width: streamWidth,
      height: streamHeight,
      channel: "allisonification",
      // channel: "lsuemdm",
      // video: "",
      // collection: "",
      parent: ["emdm.io", "concert.emdm.io", 'live.emdm.io']
    };
    
  
    let player = new Twitch.Player(streamDiv, options);
    player.addEventListener(Twitch.Player.READY, ()=>{
      player.setVolume(1.0);
      let vol = player.getVolume();
      console.log("volume = ", vol);
      // textDiv.innerHTML = `EMDM Live Stream`
    });
    this.stream = player;
  }

  addKeyCommands(keyList, work) {
    console.log(work, keyList);   // should be a set of keys to respond to and nothing else... pull from playlist.videos.keys()
    if(!keyList){   // Create of a list of keys that will trigger events
      this.keyList = Object.keys(this.playlist.videos);
    } else {
      this.keyList = keyList;
    }
    window.addEventListener("keydown", this.keyPress);

    window.addEventListener("keyup", this.keyRelease);
  }

  keyPress(event) {
    
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
    if(event.key == '~'){   // Switch into editing mode!
      this.editMode();
    }
    // Not yet pressed down?
    if(!this.keysDown.includes(event.key)) {
      this.keysDown.push(event.key);
      console.log('Keys Down', this.keysDown, this.currentWork);
      if(this.keyList.includes(event.key)){
        let video = this.getVideoInfo(event.key);
        // console.log("keydown -> video", video)
        if(video && video.type == 'loop'){
          let state = this.toggleVideo(event.key);
          hub.send('play', { val: state, video: event.key, type: video.type, work: this.currentWork, time: Date.now()});
        } else if (video) {
          this.playVideo(event.key);
          hub.send('play', { val: true, video: event.key, type: video.type, work: this.currentWork, time: Date.now()});
        }
      }
      // Cancel the default action to avoid it being handled twice
      event.preventDefault();
    }
  }

  keyRelease(event) {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
    // Already pressed down?
    if(this.keysDown.includes(event.key)) {
      this.keysDown.splice(this.keysDown.indexOf(event.key),1);
      if(this.keyList.includes(event.key)){
        let video = this.getVideoInfo(event.key);
          // one-shot doesn't stop, loop plays until you click it again. only sustain stops on key-up
        if(video && video.type == 'sustain'){
          this.pauseVideo(event.key);
          hub.send('play', { val: false, video: event.key, type: video.type, work: this.currentWork, time: Date.now()});
        }
      }
    }
    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
  }

  editMode(){
    // toggle into edit mode
    if(this.editing) {
      this.editing = false;
      this.removeKeyCommands('editing');
      let keys = Object.keys(this.playlist.videos);
      keys.forEach(key => {
        let vd = this.getVideoDiv(key);
        vd.classList.remove('editing');
      });
      this.copyToClipboard(JSON.stringify(this.playlist));
      this.addKeyCommands();
    } else {
      this.editing = true;
      this.removeKeyCommands();
      let keys = Object.keys(this.playlist.videos);
      keys.forEach(key => {
        let vd = this.getVideoDiv(key);
        vd.classList.add('editing');
      });
      this.addEditingKeyCommands();
    }
  }

  removeKeyCommands(whichKeys) {
    if(whichKeys == 'editing'){
      window.removeEventListener("keydown", this.editingKeyPress);
      window.removeEventListener("keyup", this.editingKeyRelease);
      this.videoDiv.removeEventListener("mousedown", this.editingMouseDown);
      this.videoDiv.removeEventListener("mouseup", this.editingMouseUp);
    } else {
      window.removeEventListener("keydown", this.keyPress);
      window.removeEventListener("keyup", this.keyRelease);
      
    }
  }

  copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

  addEditingKeyCommands(keyList, work) {
    console.log(work, keyList);   // should be a set of keys to respond to and nothing else... pull from playlist.videos.keys()
    if(!keyList){   // Create of a list of keys that will trigger events
      this.keyList = Object.keys(this.playlist.videos);
    } else {
      this.keyList = keyList;
    }
    window.addEventListener("keydown", this.editingKeyPress);

    window.addEventListener("keyup", this.editingKeyRelease);

    this.videoDiv.addEventListener("mousedown", this.editingMouseDown);
    this.videoDiv.addEventListener("mouseup", this.editingMouseUp);
  }

  editingMouseDown(event) {
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    this.prevMouse = {x: mouseX, y: mouseY}
    this.videoDiv.addEventListener("mousemove", this.editingMouseMove);
  }

  editingMouseUp(event) {
    this.videoDiv.removeEventListener("mousemove", this.editingMouseMove);
  }

  editingMouseMove(event) {
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    let key = this.keysDown.find(key => (key!= "Shift" && key != "Alt" && key != "Ctrl" && key != 'Meta' && key != "ArrowUp" && key != "ArrowDown" && key != "ArrowLeft" && key != "ArrowRight"));
    console.log('last key: ', key, " all keys: ", this.keysDown);
    if(key && this.keyList.includes(key) && this.keysDown.includes('Meta')) {    // Resize video
      let deltaMouse = Math.max(Math.min((this.prevMouse.y-mouseY) * 0.1, 5),0.1); // Limit rate change to 0.1 to 5
      let vidDiv = this.getVideoDiv(key);
      let video = this.getVideoInfo(key);
      let newSize = Math.max((parseFloat(video.size.x) + deltaMouse), 5);
      console.log(deltaMouse, video.size.x, parseFloat(video.size.x)+deltaMouse, newSize)
      if(deltaMouse && video.size.x && newSize){    // Make sure it is non NAN
        console.log('updating size', newSize)
        video.size.x = newSize;
        video.size.y = newSize / video.aspect;
        vidDiv.style.width = `${video.size.x}%`;  // Update size and reposition image
        vidDiv.style.height = `${video.size.y}%`;
        vidDiv.style.left = `${video.location.x - (video.size.x * 0.5)}%`;
        vidDiv.style.top = `${video.location.y - (video.size.y * 0.5)}%`;
      }
    } else {    // Process normally
      if(key && this.keyList.includes(key)) {
        let vidDiv = this.getVideoDiv(key);
        let video = this.getVideoInfo(key);
        console.log(mouseX,mouseY, video, vidDiv);   // Calculate percentage for storage
        video.location = {
          x: mouseX/window.innerWidth*100,
          y: mouseY/window.innerHeight*100
        }
        vidDiv.style.position = 'absolute';
        vidDiv.style.left = `${video.location.x - (parseFloat(video.size.x) * 0.5)}%`;
        vidDiv.style.top = `${video.location.y - (video.size.y * 0.5)}%`;
      } else {
        console.log('no video associated with key');
      }
    }
    this.prevMouse = {x: mouseX, y: mouseY}
  }

  editingKeyPress(event) {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
    if(event.key == '~'){   // Switch into editing mode!
      this.editMode();
    }
    // if(event.ctrlKey && !this.keysDown.includes('ctrl')) {
    //   console.log('ctrl down!')
    //   let mouseX = event.clientX;
    //   let mouseY = event.clientY;
    //   this.prevMouse = {x: mouseX, y: mouseY}
    //   // this.keysDown.push('ctrl');
    // } else if(!event.ctrlKey){
    //   console.log('ctrl up!')
    //   // this.keysDown.splice(this.keysDown.indexOf('ctrl'),1);
    // }
    // if(event.altKey && !this.keysDown.includes('alt')) {
    //   console.log('alt down!')
    //   let mouseX = event.clientX;
    //   let mouseY = event.clientY;
    //   this.prevMouse = {x: mouseX, y: mouseY}
    //   // this.keysDown.push('alt');
    // } else if(!event.altKey) {
    //   console.log('alt up!')
    //   // this.keysDown.splice(this.keysDown.indexOf('alt'),1);
    // }
    // if(event.metaKey && !this.keysDown.includes('Meta')) {
    //   console.log('meta down!')
    //   let mouseX = event.clientX;
    //   let mouseY = event.clientY;
    //   this.prevMouse = {x: mouseX, y: mouseY}
    //   // this.keysDown.push('Meta');
    // } else if(!event.metaKey) {
    //   console.log('meta up!')
    //   // this.keysDown.splice(this.keysDown.indexOf('Meta'),1);
    // }

    let key = this.keysDown.find(key => (key != "Shift" && key != "Alt" && key != "Ctrl" && key != 'Meta' && key != "ArrowUp" && key != "ArrowDown" && key != "ArrowLeft" && key != "ArrowRight"));
    console.log('last key: ', key, " all keys: ", this.keysDown);

    if (key && (event.key == 'ArrowUp' || event.key == 'ArrowDown')) {
      let deltaSize = 0;
      event.key == 'ArrowUp' ? deltaSize = 2: false;
      event.key == 'ArrowDown' ? deltaSize = -2: false;
      let vidDiv = this.getVideoDiv(key);
      let video = this.getVideoInfo(key);
      console.log("arrow change: ", deltaSize, parseFloat(video.size.x) + deltaSize, deltaSize + video.size.x)
      video.size.x = Math.max(parseFloat(video.size.x) + deltaSize, 4); // Limit lower size to 4%
      video.size.y = parseFloat(video.size.x) * video.aspect;
      vidDiv.style.width = `${video.size.x}%`;  // Update size and reposition image
      vidDiv.style.height = `${video.size.y}%`;
      vidDiv.style.left = `${video.location.x - (video.size.x * 0.5)}%`;
      vidDiv.style.top = `${video.location.y - (video.size.y * 0.5)}%`;
    }

    // Not yet pressed down?
    if(!this.keysDown.includes(event.key)) {
      console.log('Does not include key?', !this.keysDown.includes(event.key));
      this.keysDown.push(event.key);
      console.log('Add the key', this.keysDown, this.keyList);
      if(this.keyList.includes(event.key)){
        let video = this.getVideoInfo(event.key);
        if(video && video.type == 'loop'){
          let state = this.toggleVideo(event.key);
        } else if (video) {
          this.playVideo(event.key);
        }
      }

      // Cancel the default action to avoid it being handled twice
      event.preventDefault();
    }
  }

  editingKeyRelease(event) {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
    // Already pressed down?
    if(this.keysDown.includes(event.key)) {
      this.keysDown.splice(this.keysDown.indexOf(event.key),1);
      if(this.keyList.includes(event.key)){
        let video = this.getVideoInfo(event.key);
          // one-shot doesn't stop, loop plays until you click it again. only sustain stops on key-up
        if(video && video.type == 'sustain'){
          this.pauseVideo(event.key);
        }
      }
    }
    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
  }

  // ******* Glass video triggering and playback

    // play video by key identifier
  playVideo  (vidId, work) {
    console.log("play", vidId, work)
    if(work == this.currentWork || !work) {    // Only play if it is the current work...
      let video = this.getVideoDiv(vidId);
      let sound = this.getSound(vidId);
      // console.log("Glass -> playVideo -> video", video)
      if (sound && sound.state == 'stopped') {
        let fadeIn = this.playlist.videos[vidId].fadeIn;
        if(fadeIn <= 0) {
          fadeIn = 0.05
        }
        sound.volume.exponentialRampTo(0, fadeIn);
        sound.start();
      } else if (sound && sound.state == 'started') {
        let fadeIn = this.playlist.videos[vidId].fadeIn;
        let fadeOut = 0.05;
        if(fadeIn <= 0) {
          fadeIn = 0.05
        }
        sound.volume.exponentialRampTo(-64, fadeOut);
        sound.volume.exponentialRampTo(0, fadeIn, fadeOut);
        setTimeout((sound)=>{sound.start()},fadeOut * 1000, sound);
      }
      if (video && !video.hasAttribute('novideo')) {
        video.classList.add('glass-video-in')
        let fadeIn = this.playlist.videos[vidId].fadeIn;
        this.vidGains[video.id].gain.rampTo(1, fadeIn);
        video.currentTime = 0;
        video.play();
        console.log('Play IT!')
        return 1;
      } else if (!video) {
        console.log('No media to play')
        return 0;   // no video found
      }
    }
  }

  isVideoPlaying(video) {
    return !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
  }  

  // play video by key identifier
  toggleVideo  (vidId) {
    console.log("toggle")
    let video = this.getVideoDiv(vidId);
    let sound = this.getSound(vidId);
    // console.log("Glass -> playVideo -> video", video)
    if (video && !video.hasAttribute('novideo')) {     // video exists
      if(this.isVideoPlaying(video)) {          // and is playing
        if (sound && sound.state == 'started') {
          let fadeOut = this.playlist.videos[vidId].fadeOut;
          if(fadeOut <= 0) {
            fadeOut == 0.05;
          }
          sound.volume.exponentialRampTo(-64, fadeOut);
          setTimeout((sound)=>{sound.stop()},fadeOut * 1000, sound);
        }
        video.classList.remove('glass-video-in')
        let fadeOut = this.playlist.videos[vidId].fadeOut;
        this.vidGains[video.id].gain.rampTo(0, fadeOut);
        // Also fade out volume...
        setTimeout((vid)=>{vid.pause()},fadeOut * 1000, video);
        return false;
      } else {                                // and is not playing
        if (sound && sound.state == 'stopped') {
          let fadeIn = this.playlist.videos[vidId].fadeIn;
          if(fadeIn <= 0) {
            fadeIn = 0.05
          }
          sound.volume.exponentialRampTo(0, fadeIn);
          sound.start();
        }
        video.classList.add('glass-video-in')
        let fadeIn = this.playlist.videos[vidId].fadeIn;
        this.vidGains[video.id].gain.rampTo(1, fadeIn);
        // console.log("Glass -> toggleVideo -> this.playlist.videos[vidId].fadeIn", fadeIn)
        video.currentTime = 0;
        video.play();
        console.log('Play IT!', vidId)
        return true;
      }
    } else if (video.hasAttribute('novideo')) {      // video doesn't exist, what about sound?
      if (sound && sound.state == 'started') {
        let fadeOut = this.playlist.videos[vidId].fadeOut;
        if(fadeOut <= 0) {
          fadeOut == 0.05;
        }
        sound.volume.exponentialRampTo(-64, fadeOut);
        setTimeout((sound)=>{sound.stop()},fadeOut * 1000, sound);
      } else if (sound && sound.state == 'stopped') {
        let fadeIn = this.playlist.videos[vidId].fadeIn;
        if(fadeIn <= 0) {
          fadeIn = 0.05
        }
        sound.volume.exponentialRampTo(0, fadeIn);
        sound.start();
      }
    } else {
      console.log('No Media to play')
      return -1;   // no video found
    }
  }

  pauseVideo  (vidId) {
    let video = this.getVideoDiv(vidId);
    let sound = this.getSound(vidId);
    // console.log("Glass -> pauseVideo -> video", video)
    if(video && !video.hasAttribute('novideo')) {    // Video exists!
      video.classList.remove('glass-video-in')
      let fadeOut = this.playlist.videos[vidId].fadeOut;
      this.vidGains[video.id].gain.rampTo(0, fadeOut);
      // Also fade out volume...
      setTimeout((vid, sound)=>{
        vid.pause();
      },fadeOut * 1000, video);
      if (sound && sound.state == 'started') {
        if(fadeOut <= 0) {
          fadeOut == 0.05;
        }
        sound.volume.exponentialRampTo(-64, fadeOut);
        setTimeout((sound)=>{sound.stop()},fadeOut * 1000, sound);
      }
      return 1;
    } else if (sound && video.hasAttribute('novideo')) {   // Sound exists!
      if(sound.state == 'started') {
        let fadeOut = this.playlist.videos[vidId].fadeOut;
        if (sound && sound.state == 'started') {
          if(fadeOut <= 0) {
            fadeOut == 0.05;
          }
          sound.volume.exponentialRampTo(-64, fadeOut);
          setTimeout((sound)=>{sound.stop()},fadeOut * 1000, sound);
        }
      }
    } else {
      console.log('No video to pause')
      return -1;   // no video found
    }
  }

    // Get a video div by the key used to play it.
  getVideoDiv (vid) {
    let video;
    if(this.playlist.videos.hasOwnProperty(vid)){
      video = document.getElementById(this.playlist.videos[vid].id);
    }
    return video;
  }

  // Get a video div by the key used to play it.
  getVideoInfo (vid) {
    let video;
    if(this.playlist.videos.hasOwnProperty(vid)){
      video = this.playlist.videos[vid];
    }
    return video;
  }
  // Get an audio player by the key used to play it.
  getSound  (vid) {
    let sound;
    if(this.playlist.videos.hasOwnProperty(vid)) {
      if(this.playlist.videos[vid].hasOwnProperty('sound')){
        sound = this.glassPlayers[this.playlist.prefix][vid];
      }
    }
    return sound;
  }
}
