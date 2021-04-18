class ConcertSound {

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
    this.loadGlassVideos = this.loadGlassVideos.bind(this);
    this.loadGlassKeys = this.loadGlassKeys.bind(this);
    this.playGlassVideo = this.playGlassVideo.bind(this);
    this.pauseGlassVideo = this.pauseGlassVideo.bind(this);

    // works - wavesurfers
    this.loadWorks = this.loadWorks.bind(this);
    this.loadAudioWork = this.loadAudioWork.bind(this);
    this.audioWorkLoaded = this.audioWorkLoaded.bind(this);
    this.loadTwitchStream = this.loadTwitchStream.bind(this);
    this.loadYoutubeStream = this.loadYoutubeStream.bind(this);
    this.getWork = this.getWork.bind(this);
    this.playWork = this.playWork.bind(this);
    this.pauseWork = this.pauseWork.bind(this);
    this.stopWork = this.stopWork.bind(this);

    let canvas = document.createElement('canvas').getContext('2d');
    this.linGrad = canvas.createLinearGradient(0, 64, 0, 200);
    this.linGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1.000)');
    this.linGrad.addColorStop(0.5, 'rgba(183, 183, 183, 1.000)');

    this.hd = false;
    this.audioWorkClass = 'audio-work';
    this.videoWorkClass = 'video-work';

    this.lolArtworks = [
      {
        id: 1,
        title: 'Hocket II',
        name: 'hocket2',
        composer: 'Austin, KaHei, Kenny, Scott',
        performers: 'Austin, KaHei, Kenny, Scott',
        type: 'audio',
        file: 'low/Drip.mp3',
        fileHD: 'Drip.wav',
        image: '',
        artistTalk: '',
        divID: 'work-1'
      }, {
        id: 2,
        title: 'Glass Demonstration',
        name: 'glass-demo',
        composer: 'Jesse Allison & Saida',
        type: 'audio',
        file: 'low/Blanched_Backrooms.mp3',
        fileHD: 'Blanched_Backrooms.wav',
        image: '',
        artistTalk: '',
        divID: 'work-2'
      }, {
        id: 3,
        title: 'Choir 360: Meditations',
        name: 'choir-360',
        type: 'stream',
        service: 'youtube',
        channel: 'lsuemdm',
        composer: 'Pauline Oliveros',
        image: '',
        artistTalk: '',
        divID: 'work-3'
      }, {
        id: 4,
        title: 'Live Coding II: Max & Tweakable',
        name: 'lc-2',
        composer: 'Traci & Dylan',
        type: 'audio',
        file: 'low/EtudeHRIRPanoramaV2-C4TE.mp3',
        fileHD: 'EtudeHRIRPanoramaV2-C4TE.wav',
        artistTalk: '',
        divID: 'work-4'
      }, {
        id: 5,
        title: 'Kitchen',
        name: 'kitchen',
        composer: 'Gabe, Kenny',
        type: 'audio',
        file: 'low/Blitzkrieg.mp3',
        fileHD: 'Blitzkrieg.wav',
        image: '',
        artistTalk: '',
        divID: 'work-5'
      }, {
        id: 6,
        title: 'McLuhen Mediates the LOLs',
        name: 'mcluhen',
        composer: 'Dylan, Ka Hei',
        file: 'low/Blitzkrieg.mp3',
        fileHD: 'Blitzkrieg.wav',
        artistTalk: '',
        type: 'audio',
        info: '',
        url: 'https://youtu.be/ygoO0Hg4wAo',
        divID: 'work-6'
      }, {
        id: 7,
        title: 'Telepiano',
        name: 'telepiano',
        composer: 'Austin, Bobby, Kenny, ',
        file: 'low/Blitzkrieg.mp3',
        artistTalk: '',
        type: 'audio',
        info: '',
        url: 'https://youtu.be/ygoO0Hg4wAo',
        divID: 'work-7'
      }, {
        id: 8,
        title: 'Hocket I',
        name: 'hocket-1',
        composer: 'Dylan, Matt, Bobby',
        file: 'low/Blitzkrieg.mp3',
        artistTalk: '',
        type: 'audio',
        info: '',
        url: 'https://youtu.be/ygoO0Hg4wAo',
        divID: 'work-8'
      }, {
        id: 9,
        title: 'Live Coding I: LiveCodeLab ',
        name: 'lc-1',
        composer: 'Mary & Bobby',
        file: 'low/Blitzkrieg.mp3',
        artistTalk: '',
        type: 'audio',
        info: '',
        url: 'https://youtu.be/ygoO0Hg4wAo',
        divID: 'work-9'
      }, {
        id: 10,
        title: 'Primordial Glitches',
        name: 'mcluhen',
        composer: 'Matt Bardin',
        performers: 'The LOLs',
        file: 'low/Blitzkrieg.mp3',
        artistTalk: '',
        type: 'audio',
        info: '',
        url: 'https://youtu.be/ygoO0Hg4wAo',
        divID: 'work-10'
      }, {
        id: 11,
        title: 'Aerial',
        name: 'aerial',
        type: 'browser',
        service: 'twitch',
        channel: 'lsuemdm',
        divID: 'work-11'
      }
    ];

    this.c4teArtworks = [
      {
        id: 1,
        title: 'Drip',
        name: 'drip',
        composer: 'Austin Franklin',
        file: 'low/Drip.mp3',
        fileHD: 'Drip.wav',
        image: 'franklin-background.jpg',
        artistTalk: 'franklin-artist-talk.mp4',
        divID: 'work-1'
      }, {
        id: 2,
        title: 'BLanched Backrooms',
        name: 'backrooms',
        composer: 'Robert Chedville',
        file: 'low/Blanched_Backrooms.mp3',
        fileHD: 'Blanched_Backrooms.wav',
        image: 'pexels-oleg-magni-1040499.jpg',
        artistTalk: 'chedville-artist-talk.mp4',
        divID: 'work-2'
      }, {
        id: 3,
        title: 'Sketches of Breath',
        name: 'sketches',
        composer: 'Ka Hei Chang',
        file: 'low/Sketches_of_Breath.mp3',
        fileHD: 'sketches-binaural.wav',
        image: 'sketches-background.png',
        artistTalk: 'cheng-artist-talk.mp4',
        divID: 'work-3'
      }, {
        id: 4,
        title: 'Étude pour un ordinateur seul',
        name: 'etude',
        composer: 'Edgar Berdahl',
        file: 'low/EtudeHRIRPanoramaV2-C4TE.mp3',
        fileHD: 'EtudeHRIRPanoramaV2-C4TE.wav',
        artistTalk: 'berdahl-artist-talk.mp4',
        divID: 'work-4'
      }, {
        id: 5,
        title: 'Blitzkrieg',
        name: 'blitzkrieg',
        composer: 'Scott Nelson',
        file: 'low/Blitzkrieg.mp3',
        fileHD: 'Blitzkrieg.wav',
        image: 'blitzkrieg-background.png',
        artistTalk: 'nelson-artist-talk.mp4',
        divID: 'work-5'
      }, {
        id: 6,
        title: 'Primatives III. Release',
        name: 'release',
        composer: 'Chase Mitchusson',
        file: 'Primitives-Release.mp4',
        artistTalk: 'mitchusson-artist-talk.mp4',
        type: 'video',
        info: 'Primitives is a piece by Chase Mitchusson composed in VR using the Indeterminate Sample Sequencer, a tool he developed for VR using Unity',
        url: 'https://youtu.be/ygoO0Hg4wAo',
        divID: 'work-6'
      }, {
        id: 7,
        title: 'Live Stream',
        name: 'stream',
        type: 'stream',
        service: 'twitch',
        channel: 'lsuemdm',
        divID: 'work-7'
      }, {
        id: 8,
        title: '360 Live Stream',
        name: '360stream',
        type: 'stream',
        service: 'youtube',
        channel: 'lsuemdm',
        divID: 'work-8'
      }
    ];
    this.artworks = this.lolArtworks;

    this.audioWorkDivs = document.getElementsByClassName(this.audioWorkClass);
    // this.mediaPath = '/media/';
    // this.mediaPath = 'https://emdm-c4te-f2020.storage.googleapis.com/media/';
    this.mediaPath = 'https://emdm-lols-2020.storage.googleapis.com/media/';

    if(ctx || hub.ctx) {
      // use context in setting up tone...
      // ctx ? Tone.setContext(ctx) : Tone.setContext(hub.ctx);
    }
    this.context = hub.ctx;
    // this.tone = new Tone();
    


    this.sampleLength = 5;    // in seconds

    
    // Effects and Synths

    // this.gain = new Tone.Gain({gain:1.0}).toMaster();
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
    this.player[0] = new Tone.Player(this.mediaPath + "E-bass-Small.mp3").toDestination();
    this.player[1] = new Tone.Player(this.mediaPath + "E-bass-Small.mp3").toDestination();
    this.player[0].volume.value = -18;
    this.player[1].volume.value = -10;

    Tone.Transport.start();

    this.pitchCollection = [55, 57, 59, 61, 62, 64, 66, 67, 68, 69, 71, 73, 75, 76, 78, 80, 82, 83];

    this.pitch = this.pitchCollection[Math.floor(Math.random() * (this.pitchCollection.length))];
    console.log("Pitch & Length:", this.pitch, this.pitchCollection.length);
    
    this.vidNodes = {};
    this.vidGains = {};
    this.keysDown = [];

    // this.loadWorks();
  };

  //  CONSTRUCTOR Complete //


  masterGain(val) {
    this.gain.gain.rampTo(val, 0.015);
  };

  playbackRate(val) {
    this.wavesurfer.setPlaybackRate(val);
  }

  freq (midi) {
    // var note = Tone.mtof(midi);
    var note = Tone.Frequency(midi).toFrequency();
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

  ////// Audio Work Loading

  loadWorks(concert) {
    //Instatiate all of the audio works
    if(concert == 'c4te'){
      this.artworks = this.c4teArtworks;
    } else if (concert == 'lols') {
      this.artworks = this.lolArtworks;
    }
    for (let work of this.artworks) {
      // This may not be the best - it relies on the ID plus the type class...
      if(work.divID) {
        work.div = document.getElementById(work.divID);
        work.waveDiv = document.querySelector(`#${work.divID} .audio-work`);
        work.videoDiv = document.querySelector(`#${work.divID} .video-work`);
        work.streamDiv = document.querySelector(`#${work.divID} .stream`);
      } else {
        if (this.audioWorkDivs.length > 0){
          for (let div of this.audioWorkDivs){
            if (!div.id) {
              work.div = div;
              div.id = 'work-'+ work.file;
            }
          }
        } else {
          console.log('No Open divs to load this Audio Work');
          continue;
        }
      }
      // work.div.style.transition = 'all 3s cubic-bezier(0.250, 0.460, 0.450, 0.940)';

      if (work.type == 'video') {     // Load video work
        work.titleDiv = document.createElement('span');
        work.titleDiv.innerHTML = work.title;
        work.titleDiv.classList.add('title');
        work.div.prepend(work.titleDiv);

        work.video = document.createElement('video');
        work.video.src = this.mediaPath+ work.file;
        // work.video.height = work.div.clientHeight;
        // work.video.width = work.div.clientWidth;
        // console.log(work.div.clientHeight);
        work.videoDiv.appendChild(work.video);
        // audioWork.waveBox = audioWork.div.getBoundingClientRect(); 

        work.videoAudioNode = Tone.context.rawContext.createMediaElementSource(work.video);
        work.videoGainNode = new Tone.Gain({gain:1.0}).connect(this.gain);
        work.videoAudioNode.connect(work.videoGainNode);

        document.getElementById('progress-'+work.id).style.display = 'none';
      } else if (work.type == 'browser'){    // Load Browser Work
        // stuff
      } else if (work.type == 'audio' || work.type == undefined){    // Load Audio Work
        work.type = 'audio';
        // Included Image or Folder?
        if(work.image != undefined) {
          work.div.style.backgroundImage = `url('${this.mediaPath}${work.image}')`;
          work.div.style.backgroundPosition = 'center';
          work.div.style.backgroundSize = 'cover';
        }

        if(work.title != undefined) {
          work.titleDiv = document.createElement('span');
          work.titleDiv.innerHTML = work.title;
          work.titleDiv.classList.add('title');
          work.div.appendChild(work.titleDiv);
        }
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent || '') ||
        /iPad|iPhone|iPod/i.test(navigator.userAgent || '');
  
        let wavesurferArgs = {
          container: work.waveDiv,
          audioContext: this.context,
          fillParent: true,
          waveColor: this.linGrad,  
          // wavecolor: hub.user.color,
          // backgroundColor: 'rgba(253,240,223,0.77)',
          progressColor: 'hsla(200, 100%, 30%, 0.5)',
          cursorColor: '#fff',
          barWidth: 3,
          responsive: true,
          interact: false
        }
        if (isSafari) {
          wavesurferArgs.backend = 'MediaElement';
        }

        // WaveSurfer Display
        work.wave = WaveSurfer.create(wavesurferArgs);
        // work.wave.backend.setFilter(this.gain);
        // work.wave.setVolume(0.);
        work.waveDiv.classList.add('bottom');
        work.wave.on('loading', function (percents) {
          document.getElementById('progress-'+work.id).value = percents;
        });
    
        work.wave.on('ready', function () {
          document.getElementById('progress-'+work.id).style.display = 'none';
        });
        let audioFile = this.hd ? work.fileHD : work.file;
        this.loadAudioWork(audioFile, work);
      } else if (work.type == 'stream') {       // Make a Stream
        if(work.service == 'twitch'){
          setTimeout(this.loadTwitchStream(work), 5000);
        } else if (work.service == 'youtube') {
          // setTimeout(this.loadYoutubeStream(work), 5000);
        }
      }

            // Load Artist talks
      if(work.artistTalk) {
        console.log('Artist Talk', work.artistTalk)
        work.artistTalkDiv = document.createElement('video');
        work.artistTalkDiv.classList.add('artist-talk');
        work.artistTalkDiv.src = this.mediaPath+ work.artistTalk;
        // work.video.height = work.div.clientHeight;
        // work.video.width = work.div.clientWidth;
        // console.log(work.div.clientHeight);
        
        work.div.appendChild(work.artistTalkDiv);
      }
    }
  }

  loadTwitchStream(work) {
    if(work.title != undefined) {
      work.titleDiv = document.createElement('span');
      work.titleDiv.innerHTML = work.title;
      work.titleDiv.classList.add('title');
      work.div.appendChild(work.titleDiv);
    } else {
      work.titleDiv = document.querySelector('#stream-text');
    }
    work.questionDiv = document.querySelector('#q-and-a');
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
      parent: ["emdm.io", "concert.emdm.io"]
    };
    
  
    let player = new Twitch.Player("twitch-stream", options);
    player.addEventListener(Twitch.Player.READY, ()=>{
      player.setVolume(0.8);
      let vol = player.getVolume();
      console.log("volume = ", vol);
      let textDiv = document.getElementById('stream-text');
      textDiv.classList.add('bottom');
      // textDiv.innerHTML = `Player Volume is ${vol}`
      // textDiv.innerHTML = `The performance begins at 23:15 UTC+1 (5:15 CDT, 3:15 PDT)`
      textDiv.innerHTML = `EMDM Live Stream`
    });
    work.stream = player;
  }

  loadYoutubeStream(work) {
    if(work.title != undefined) {
      work.titleDiv = document.createElement('span');
      work.titleDiv.innerHTML = work.title;
      work.titleDiv.classList.add('title');
      work.div.appendChild(work.titleDiv);
    } else {
      work.titleDiv = document.querySelector('#stream-text');
    }
    work.questionDiv = document.querySelector('#q-and-a');
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
      channel: "lsuemdm",
      // video: "",
      // collection: "",
      parent: ["emdm.io", "concert.emdm.io"]
    };
    
  
    let player = new Twitch.Player("twitch-stream", options);
    player.addEventListener(Twitch.Player.READY, ()=>{
      player.setVolume(0.8);
      let vol = player.getVolume();
      console.log("volume = ", vol);
      let textDiv = document.getElementById('stream-text');
      textDiv.classList.add('bottom');
      // textDiv.innerHTML = `Player Volume is ${vol}`
      // textDiv.innerHTML = `The performance begins at 23:15 UTC+1 (5:15 CDT, 3:15 PDT)`
      textDiv.innerHTML = `EMDM Live Stream`
    });
    work.stream = player;
  }

  loadAudioWork(url, audioWork, playOnLoad=false) {
    console.log('Loading Audio Work: ', url);
    audioWork.wave.on('ready', () => {
      console.log('Audio Ready', audioWork);
      this.audioWorkLoaded(audioWork,playOnLoad)
      document.getElementById('progress-'+audioWork.id).style.display = 'none';
    });
  
    audioWork.wave.load(this.mediaPath + url);
    // controlBlurring(true);
  }

  audioWorkLoaded(audioWork, playOnLoad=false) {
    console.log('Audio Work Loaded!')
    // controlBlurring(false);
    // audioWork.waveHeight = audioWork.div.clientHeight;
    // this.wavesurfer.setHeight(waveHeight);
    // audioWork.waveBox = audioWork.div.getBoundingClientRect();  // .y, .width = 375
    if(playOnLoad){
      this.play();
    }
  }

    // getWork by name or ID or...
  getWork(work) {
    let artwork = this.artworks.find((obj) => {
      let returnedWork = obj.name === work;
      if (!returnedWork) {
        returnedWork = obj.id === work;
      }
      return returnedWork
    })
    return artwork
  }

  playWork(artwork, seek) {
    let work = this.getWork(artwork);
    if(work.staged) {
      if(work.type == 'video'){
        if(!work.video.paused && !seek) {
          work.video.pause();
          return 'paused';
        }
        if (seek){
          work.video.currentTime = seek;
          work.video.play();
        } else {
          work.video.play();
        }
        return 'playing';
      } else if (work.type == 'stream') {
        if (work.stream.isPaused()) {
          work.stream.play();
        } else {
          work.stream.pause();
        }
      } else if (work.type == 'audio' || work.type == 'undefined') {
        if(work.wave.isPlaying()) {
          work.wave.pause();
          return 'paused';
        }
        if(seek) {
          work.wave.play(seek)
        } else {
          work.wave.play();
        }
        return 'playing';
      }
    }
  }

  pauseWork(artwork) {
    let work = this.getWork(artwork);
    if(work.type == 'video'){
      work.video.pause();
    } else if (work.type == 'stream') {
        work.stream.pause();
    } else {
      if(work.wave.isPlaying()) {
        work.wave.pause();
      }
    }
  }

  stopWork(artwork) {
    let work = this.getWork(artwork);
    if(work.type == 'video'){
      work.video.pause();
      work.video.currentTime = 0;
    } else if (work.type == 'stream') {
        work.stream.pause();
    } else {
      work.wave.stop();
    }
  }

  gainWork(artwork, gain) {
    let work = this.getWork(artwork);
    if(work.type == 'video'){
      work.video.volume = gain;
    } else if (work.type == 'stream') {
      work.stream.setVolume(gain);
    } else {
      work.wave.setVolume(gain);
    }
  }

  playArtistTalk(artistTalk, play) {
    let work = this.getWork(artistTalk);
    if(play && work.artistTalkDiv.paused){
      work.artistTalkDiv.classList.add('artist-speaks', 'center');
      if(work.type == 'audio' || work.type == undefined) {
        work.waveDiv.classList.remove("center");
      } else if (work.type == 'video'){

      }
      // work.waveDiv.classList.add("bottom");
      work.artistTalkDiv.play();
      work.artistTalkDiv.addEventListener('ended', (e)=>{
        if(work.type == 'audio' || work.type == undefined) {
          if(work.image != undefined){
            work.waveDiv.classList.add('bottom');
          } else {
            work.waveDiv.classList.add('center');
          }
        } else if (work.type == 'video'){
  
        }
        work.artistTalkDiv.classList.remove("artist-speaks");
      })
    } else if (play == false || !work.artistTalkDiv.paused) {
      if(work.type == 'audio' || work.type == undefined) {
        if(work.image != undefined){
          work.waveDiv.classList.add('bottom');
        } else {
          work.waveDiv.classList.add('center');
        }
      } else if (work.type == 'video') {

      }
      work.artistTalkDiv.classList.remove("artist-speaks");
      work.artistTalkDiv.pause();
    }
  }





  ////// Glasses VIDEO Loading 

  loadGlassVideos() {
    for (let vid in glassClips) {
			let x = document.createElement("VIDEO");
			x.setAttribute('id', vid)
			// x.style.visibility = 'invisible';
			if (x.canPlayType("video/mp4")) {
			    x.setAttribute("src",glassClips[vid]);
			} else {
			    // x.setAttribute("src","movie.ogg");
			}

			x.setAttribute("width", "136");
			x.setAttribute("height", "240");
			if (x.hasAttribute("controls")) {
		     x.removeAttribute("controls")   
			}
			x.setAttribute('loop', true)
			videoBank.appendChild(x);
			x.onclick = function() {
				console.log (this)
				if (this.paused) {
          this.classList.remove('fadeOut');
          this.classList.add('fadeIn');
					this.play();
				} else {
          this.classList.remove('fadeIn');
          this.classList.add('fadeOut');
					setTimeout(()=>{this.pause()},3000);
				}
      }
      
      this.vidNodes[vid] = Tone.context.rawContext.createMediaElementSource(x);
      this.vidGains[vid] = new Tone.Gain({gain:0.0}).connect(this.gain);
      this.vidNodes[vid].connect(this.vidGains[vid]);
    }

    this.loadGlassKeys();
  }

  loadGlassKeys () {
		window.addEventListener("keydown", function (event) {
		  if (event.defaultPrevented || event.metaKey) {
		    return; // Do nothing if the event was already processed
      }
      
        // Not yet pressed down?
      if(!this.keysDown.includes(event.key)) {
  		  switch (event.key) {
  		    case "1":
  		      this.playGlassVideo('g')
  		      break;
  		    case "2":
  					this.playGlassVideo('a')
  		      break;
  		    case "3":
  					this.playGlassVideo('b')
  		      break;
  		    case "4":
  					this.playGlassVideo('c')
  					break;
  				case "5":
  					this.playGlassVideo('d')
  					break;
  				case "6":
  					this.playGlassVideo('e')
  					break;
  				case "7":
  					this.playGlassVideo('f')
  					break;
  				case "8":
  					this.playGlassVideo('G')
  					break;
  				case "9":
  					this.playGlassVideo('bass')
  					break;
  				case "0":
  					this.playGlassVideo('squeek')
  					break;
  		    default:
  		      return; // Quit when this doesn't handle the key event.
        }
        this.keysDown.push(event.key);
      }
		  // Cancel the default action to avoid it being handled twice
		  event.preventDefault();
		}, true);

		window.addEventListener("keyup", function (event) {
		  if (event.defaultPrevented || event.metaKey) {
		    return; // Do nothing if the event was already processed
		  }
        if(this.keysDown.includes(event.key)) {
  		  switch (event.key) {
  		    case "1":
  		      this.pauseGlassVideo('g')
  		      break;
  		    case "2":
  					this.pauseGlassVideo('a')
  		      break;
  		    case "3":
  					this.pauseGlassVideo('b')
  		      break;
  		    case "4":
  					this.pauseGlassVideo('c')
  					break;
  				case "5":
  					this.pauseGlassVideo('d')
  					break;
  				case "6":
  					this.pauseGlassVideo('e')
  					break;
  				case "7":
  					this.pauseGlassVideo('f')
  					break;
  				case "8":
  					this.pauseGlassVideo('G')
  					break;
  				case "9":
  					this.pauseGlassVideo('bass')
  					break;
  				case "0":
  					this.pauseGlassVideo('squeek')
  					break;
  		    default:
  		      return; // Quit when this doesn't handle the key event.
        }
        this.keysDown.splice(this.keysDown.indexOf(event.key),1);
      }
		  // Cancel the default action to avoid it being handled twice
		  event.preventDefault();
		}, true);

  }

  
  playGlassVideo (vid) {
    let video = document.getElementById(vid);
    hub.send('play', { val: true, video: vid, time: Date.now()});
    video.classList.remove('fadeOut');
    video.classList.add('fadeIn');
    this.vidGains[vid].gain.rampTo(1, 3);
    video.play();
  }

  pauseGlassVideo (vid) {
    let video = document.getElementById(vid);
    hub.send('play', { val: false, video: vid, time: Date.now()});
    video.classList.remove('fadeIn');
    video.classList.add('fadeOut');
    this.vidGains[vid].gain.rampTo(0, 3);
    // Also fade out volume...
    setTimeout((vid)=>{vid.pause()},3000, video);
  }

}
