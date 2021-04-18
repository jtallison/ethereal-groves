class Artworks {

  constructor(ctx) {
    // works
    this.generateControlUI = this.generateControlUI.bind(this);
    this.playlistLoaded = false;
    this.loadWorks = this.loadWorks.bind(this);
    this.loadAudioWork = this.loadAudioWork.bind(this);
    this.audioWorkLoaded = this.audioWorkLoaded.bind(this);
    this.twitchChannel = 'allisonification';
    this.twitchStream;
    this.loadTwitchStream = this.loadTwitchStream.bind(this);
    this.setTwitchChannel = this.setTwitchChannel.bind(this);
    this.youtubeStream;
    this.loadYoutubeStream = this.loadYoutubeStream.bind(this);
    this.getWork = this.getWork.bind(this);
    this.playWork = this.playWork.bind(this);
    this.pauseWork = this.pauseWork.bind(this);
    this.stopWork = this.stopWork.bind(this);
    
    this.stageWork = this.stageWork.bind(this);
    this.currentWork;

    // linear gradient...
    let canvas = document.createElement('canvas').getContext('2d');
    this.linGrad = canvas.createLinearGradient(0, 64, 0, 200);
    this.linGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1.000)');
    this.linGrad.addColorStop(0.5, 'rgba(183, 183, 183, 1.000)');

    // this.mediaPath = '/media/';
    // this.mediaPath = 'https://emdm-c4te-f2020.storage.googleapis.com/media/';
    this.mediaPath = 'https://emdm-lols-2020.storage.googleapis.com/media/';
    // this.lowResMediaPath = 'https://emdm-c4te-f2020.storage.googleapis.com/media/low/';
    this.lowResMediaPath = 'https://emdm-lols-2020.storage.googleapis.com/media/low/';
    this.artworkDiv = 'artworks';
    this.artworkControls = {};

    // this.artworks = [];
    this.artworks = lolF2020Artworks;   // Preload or just load when passed in?

    let gradientCanvas = document.createElement('canvas').getContext('2d');
    this.linGrad = gradientCanvas.createLinearGradient(0, 64, 0, 200);
    this.linGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1.000)');
    this.linGrad.addColorStop(0.5, 'rgba(183, 183, 183, 1.000)');

    // Populating works
    this.audioWorkClass = 'audio-work';
    this.videoWorkClass = 'video-work';
    this.audioWorkDivs = document.getElementsByClassName(this.audioWorkClass);

    this.isSafari = false;  // Useful.

    // Tone Audio Setup
    // this.mediaPath = '/media/';
    // this.mediaPath = 'https://emdm-c4te-f2020.storage.googleapis.com/media/';

    if(ctx || hub.ctx) {
      // use context in setting up tone...
      // ctx ? Tone.setContext(ctx) : Tone.setContext(hub.ctx);
    }
    this.context = hub.ctx;
    // this.tone = new Tone();

    this.hd = false;
    this.masterGain = this.masterGain.bind(this);
    this.gain = new Tone.Gain({gain:1.0}).toDestination();

    this.vidNodes = {};
    this.vidGains = {};
    this.keysDown = [];

    // this.loadWorks();
  }

  validateWorks(works) {
    // cycle through all artworks and create new default values if not provided
    if(works == undefined){
      works = this.artworks;
    }

    for (let work of works) {
      if(work.staged == undefined){
        work.staged = false;
      }
      if(work.id == undefined) {
        // create list of all id numbers and fill in the gaps
      }
      if(work.name == undefined) {
        // set name = title with no spaces and sanitized...
      }
    }

    this.artworks = works
  }

  masterGain(gain) {
    this.gain.gain.rampTo(gain, 0.03);
    this.stream ? this.stream.setVolume(gain) : null;   // Hack until I can get the media div and control it via webaudio nodes
    this.twitchStream ? this.twitchStream.setVolume(gain) : null;
    this.youtubeStream ? this.youtubeStream.setVolume(gain) : null;
  };


// ***************************************************************************
  // ********** Create Control UI

  generateControlUI(workName) {
    console.log(workName)
    let work = this.getWork(workName);
    /* Generating controls for a specific work
    <div id='work-10' class='controls'>
      <span id='title10'>Title 10</span>
      <span id='stage10' nexus-ui='toggle'>Staged</span>
      <span id='play' nexus-ui='button'>Play/Pause</span>
      <span id='stop10' nexus-ui='button'>Stop</span>
      <span id='seek10' nexus-ui='number'>Seek</span>
      <span id='gain10' nexus-ui='slider'>Gain</span>
    </div>*/
    // work.controls = {};
    // work div
    let controlDiv = document.createElement("div");
    controlDiv.setAttribute("id", "work-" + work.id);
    controlDiv.setAttribute("class", "controls");

    // Title div
    let title = document.createElement("span");
    title.setAttribute("id", "title");
    title.setAttribute("class", "work-title");
    let titleText = document.createTextNode(work.title);
    title.appendChild(titleText);
    controlDiv.appendChild(title);
    
    // stage div
    let stage = document.createElement("span");
    stage.setAttribute("id", "stage"+ work.id);
    stage.setAttribute('work', work.id);
    stage.setAttribute('name', work.name);
    stage.setAttribute("nexus-ui", "toggle");
    // stage.setAttribute('style', "width:100px;height:50px");
    stage.classList.add('stage-toggle');
    let stageLabel = document.createElement("span");
    let stageLabelText = document.createTextNode("Stage");
    stageLabel.setAttribute("class", "stageWorkLabel");
    stageLabel.appendChild(stageLabelText);
    controlDiv.appendChild(stageLabel);
    controlDiv.appendChild(stage);

    // play div
    let play = document.createElement("span");
    play.setAttribute("id", "play"+ work.id);
    play.classList.add('play-button');
    play.setAttribute('work', work.id);
    play.setAttribute('name', work.name);
    play.setAttribute("nexus-ui", "button");
    // play.setAttribute("class", "playUserSample");
    let playLabel = document.createElement("span");
    let playLabelText = document.createTextNode("Play");
    playLabel.setAttribute("class", "playWorkLabel");
    playLabel.appendChild(playLabelText);
    controlDiv.appendChild(playLabel);
    controlDiv.appendChild(play);
    // this.playNX[currentSample] = new Nexus.Toggle("#play-"+ currentSample);

    // this.playNX[currentSample].on('change', (v) => {
    //   if(this.sampleHasLoop(currentSample)) {
    //     v ? this.wavesurfers[currentSample].regions.list[0].play() : this.wavesurfers[currentSample].pause();
    //   }
    // });

    // Stop div
    let stop = document.createElement("span");
    stop.setAttribute("id", "stop"+ work.id);
    stop.classList.add('stop-button');
    stop.setAttribute('work', work.id);
    stop.setAttribute('name', work.name);
    stop.setAttribute("nexus-ui", "button");
    let stopLabel = document.createElement("span");
    let stopLabelText = document.createTextNode("Stop");
    stopLabel.setAttribute("class", "stopWorkLabel");
    stopLabel.appendChild(stopLabelText);
    controlDiv.appendChild(stopLabel);
    controlDiv.appendChild(stop);

    // Seek div
    let seek = document.createElement("span");
    seek.setAttribute("id", "seek"+ work.id);
    seek.classList.add('seek-number');
    seek.setAttribute('work', work.id);
    seek.setAttribute('name', work.name);
    seek.setAttribute("nexus-ui", "number");
    let seekLabel = document.createElement("span");
    let seekLabelText = document.createTextNode("Seek");
    seekLabel.setAttribute("class", "seekWorkLabel");
    seekLabel.appendChild(seekLabelText);
    controlDiv.appendChild(seekLabel);
    controlDiv.appendChild(seek);

    // talk div
    let talk = document.createElement("span");
    talk.setAttribute("id", "talk"+ work.id);
    talk.classList.add('talk-button');
    talk.setAttribute('work', work.id);
    talk.setAttribute('name', work.name);
    talk.setAttribute("nexus-ui", "button");
    let talkLabel = document.createElement("span");
    let talkLabelText = document.createTextNode("Talk");
    talkLabel.setAttribute("class", "talkWorkLabel");
    talkLabel.appendChild(talkLabelText);
    controlDiv.appendChild(talkLabel);
    controlDiv.appendChild(talk);

    // Gain div
    let gain = document.createElement("span");
    gain.setAttribute("id", "gain"+ work.id);
    gain.classList.add('gain-slider');
    gain.setAttribute('work', work.id);
    gain.setAttribute('name', work.name);
    gain.setAttribute("nexus-ui", "slider");
    let gainLabel = document.createElement("span");
    let gainLabelText = document.createTextNode("Gain");
    gainLabel.setAttribute("class", "gainWorkLabel");
    gainLabel.appendChild(gainLabelText);
    controlDiv.appendChild(gainLabel);
    controlDiv.appendChild(gain);

    document.getElementById(this.artworkDiv).appendChild(controlDiv);
    
    let controls =  new Nexus.Rack("work-" + work.id);
    console.log(controls)
    this.artworkControls['work'+work.id] = controls;

    controls['stage'+ work.id].on ('change', function(v) {
      console.log('stage', v, this)
      hub.send('artwork', {
        work: Number(this.settings.work),
        stage: v
      });
    });
    controls['play'+ work.id].mode = 'button'
    controls['play'+ work.id].on ('change', function(v) {
      console.log('play', v, this, this.clicked)
      if (this.clicked) {
        if(v) {
          hub.send('artwork', {
            work: this.settings.name,
            play: true
          });
        } else {
          hub.send('artwork', {
          work: this.settings.name,
          pause: true
        });
        }
      };
    });
    controls['stop'+ work.id].mode = 'button'
    controls['stop'+ work.id].on ('change', function(v) {
      console.log('stop', v, this)
      if (this.clicked) {
        if(v) {
          hub.send('artwork', {
            work: this.settings.name,
            stop: true
          });
        } 
      };
    });
    controls['seek'+ work.id].on ('change', function(v) {
      console.log('seek', v, this)
      if (!this.clicked) {    // Only send when not clicking and dragging
        hub.send('artwork', {
          work: this.settings.name,
          seek: v
        });
      };
    });
    controls['talk'+ work.id].mode = 'button'
    controls['talk'+ work.id].on ('change', function(v) {
      console.log('talk', v, this, this.clicked)
      if (this.clicked) {
        if(v) {
          hub.send('artwork', {
            work: this.settings.name,
            artistTalk: true
          });
        } else {
          hub.send('artwork', {
            work: this.settings.name,
            artistTalk: false
          });
        }
      };
    });
    controls['gain'+ work.id].value = 1.0;
    controls['gain'+ work.id].on ('change', function(v) {
      console.log('gain', v, this)
      if (this.clicked) {
        if(v) {
          hub.send('artwork', {
            work: this.settings.name,
            gain: v
          });
        } 
      };
  	});
    console.log("work UI Created", work.id)
  }

// ***************************************************************************
  // ****** Concert Work Loading

  loadWorks(concert) {
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent || '') ||
        /iPad|iPhone|iPod/i.test(navigator.userAgent || '');

    //Instatiate all of the audio works
    if(concert == 'c4te'){
      this.artworks = this.c4teArtworks;
    } else if (concert == 'lols') {
      this.artworks = this.lolArtworks;
    }
    this.concertDiv = document.getElementById('concert-display')
    for (let work of this.artworks) {
      // This may not be the best - it relies on the ID plus the type class...
      if(work.divID) {
        work.div = document.getElementById(work.divID);
        work.waveDiv = document.querySelector(`#${work.divID} .audio-work`);
        work.videoDiv = document.querySelector(`#${work.divID} .video-work`);
        // work.streamDiv = document.querySelector(`#${work.divID} .stream`); // now this is shared
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
        if (!work.videoDiv) {
          work.videoDiv = document.createElement('div');
          work.videoDiv.id = work.divID;
          work.videoDiv.classList.add('video-work');
          work.div.appendChild(work.videoDiv);
        }
        work.titleDiv = document.createElement('span');
        work.titleDiv.innerHTML = work.title;
        work.titleDiv.classList.add('title');
        work.div.prepend(work.titleDiv);
        let progress = document.createElement('progress');
        progress.id = 'progress-'+work.id;
        progress.classList = 'progress progress-striped';
        progress.max = 100;
        progress.value = 0;
        work.div.prepend(progress);

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
        if (!work.waveDiv) {
          work.waveDiv = document.createElement('div');
          work.waveDiv.classList.add('audio-work');
          work.div.appendChild(work.waveDiv);
        }
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
          work.div.prepend(work.titleDiv);
        }
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent || '') ||
        /iPad|iPhone|iPod/i.test(navigator.userAgent || '');

        let progress = document.createElement('progress');
        progress.id = 'progress-'+work.id;
        progress.classList = 'progress progress-striped';
        progress.max = 100;
        progress.value = 0;
        work.div.appendChild(progress);
  
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
        // work.waveDiv.classList.add('bottom');
        work.wave.on('loading', function (percents) {
          document.getElementById('progress-'+work.id).value = percents;
        });
    
        work.wave.on('ready', function () {
          document.getElementById('progress-'+work.id).style.display = 'none';
        });
        let audioFile = this.hd ? work.fileHD : work.file;
        this.loadAudioWork(audioFile, work);
      } else if (work.type == 'glass') {
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
          work.div.prepend(work.titleDiv);
        }

        work.gain = new Tone.Gain({gain:1.0}).connect(this.gain);        
      } else if (work.type == 'mcluhen') {
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
          work.div.prepend(work.titleDiv);
        }
      }
      
      if (work.type != 'stream' && work.service == 'twitch') {
        if(this.twitchStream) {
          work.stream = this.twitchStream;
          work.streamDiv = this.twitchStreamDiv;
        } else {    // create the twitch Stream
          // setTimeout(this.loadTwitchStream(work), 5000);
          this.twitchStream = this.loadTwitchStream(work);
          work.stream = this.twitchStream;
          work.streamDiv = this.twitchStreamDiv;
        }
      }

          // Stream as work type or service loading...
      if (work.type == 'stream' || work.service) {       // Make a Stream
        if(work.type == 'stream' && work.service == 'twitch'){
          work.titleDiv = document.createElement('span');
          work.titleDiv.classList.add('title');
          work.titleDiv.classList.add('no-display');
          work.div.appendChild(work.titleDiv);
          if(work.title != undefined) {
            work.titleDiv.innerHTML = work.title;
            work.titleDiv.classList.remove('no-display');
          }
          work.questionDiv = document.querySelector('#q-and-a');
          if(!work.questionDiv) {
            work.questionDiv = document.createElement('div');
            work.questionDiv.setAttribute('id', 'q-and-a');
          }
          work.questionDiv.classList.add('bottom');
          work.questionDiv.classList.add('no-display');
          let questions = document.createElement('div');
          questions.classList.add('questions');
          questions.innerHTML = 'Current Q&A Question';
          let question = document.createElement('text-area');
          question.setAttribute('id', 'my-question');
          question.setAttribute('type', 'text');
          question.setAttribute('name', 'question');
          question.setAttribute('cols', '0');
          question.setAttribute('rows', '2');
          let askQuestion = document.createElement('span');
          askQuestion.setAttribute('id', 'ask-my-question');
          work.questionDiv.appendChild(questions);
          work.questionDiv.appendChild(question);
          work.questionDiv.appendChild(askQuestion);
          work.div.appendChild(work.questionDiv);
          if(work.qAndA) {
            work.questionDiv.classList.remove('no-display');
          }

          if(this.twitchStream) {
            work.stream = this.twitchStream;
            work.streamDiv = this.twitchStreamDiv;
          } else {    // create the twitch Stream
            // setTimeout(this.loadTwitchStream(work), 5000);
            this.twitchStream = this.loadTwitchStream(work);
            work.stream = this.twitchStream;
            work.streamDiv = this.twitchStreamDiv;
          }
        } else if (work.type == 'stream' && work.service == 'youtube') {
          if(work.type == 'stream' && work.service == 'youtube'){
            work.titleDiv = document.createElement('span');
            work.titleDiv.classList.add('title');
            work.titleDiv.classList.add('no-display');
            work.div.appendChild(work.titleDiv);
            if(work.title != undefined) {
              work.titleDiv.innerHTML = work.title;
              work.titleDiv.classList.remove('no-display');
            }
            work.questionDiv = document.querySelector('#q-and-a');
            if(!work.questionDiv) {
              work.questionDiv = document.createElement('div');
              work.questionDiv.setAttribute('id', 'q-and-a');
            }
            work.questionDiv.classList.add('bottom');
            work.questionDiv.classList.add('no-display');
            let questions = document.createElement('div');
            questions.classList.add('questions');
            questions.innerHTML = 'Current Q&A Question';
            let question = document.createElement('text-area');
            question.setAttribute('id', 'my-question');
            question.setAttribute('type', 'text');
            question.setAttribute('name', 'question');
            question.setAttribute('cols', '0');
            question.setAttribute('rows', '2');
            let askQuestion = document.createElement('span');
            askQuestion.setAttribute('id', 'ask-my-question');
            work.questionDiv.appendChild(questions);
            work.questionDiv.appendChild(question);
            work.questionDiv.appendChild(askQuestion);
            work.div.appendChild(work.questionDiv);
            if(work.qAndA) {
              work.questionDiv.classList.remove('no-display');
            }
                // When we have enough followers..., load youtubeStream
            if(this.youtubeStream) {
              // work.stream = this.youtubeStream;
              work.streamDiv = this.youtubeStreamDiv;
            } else {    // create the twitch Stream
              // setTimeout(this.loadYoutubeStream(work), 5000);
              this.youtubeStream = this.loadYoutubeStream(work);
              // work.stream = this.twitchStream;
              this.youtubeStream = true
              this.youtubeStreamDiv.insertAdjacentHTML('afterbegin', '<iframe width="560" height="315" src="https://www.youtube.com/embed/E9-JSxNPsJ0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>')
              work.streamDiv = this.youtubeStreamDiv;
            }
          }
        } else if (work.type == 'stream' && work.service == 'facebook') {

        }
      }
      
      // More General Items to add to the display
      
      if(work.moreInfo && Object.keys(work.moreInfo).length > 0 ) {
        // insert moreInfo button
        console.log(work.moreInfo);
        let more = document.createElement('img');
        more.src = "/media/more-info.png";
        more.classList.add('more-info-button');
        more.setAttribute('moreInfoDiv', work.moreInfo.divId);
        more.onclick = (event)=>{
          let moreInfoDiv = document.getElementById(event.target.getAttribute('moreInfoDiv'));
          moreInfoDiv.classList.add('show-more-info');
        }
        work.div.appendChild(more);
      }

      if (work.info) {
        let info = document.createElement('p');
        info.classList.add('info');
        info.insertAdjacentHTML('afterbegin',work.info);
        // info.innerText = work.info;
        work.div.appendChild(info);
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

    this.validateWorks();
    this.playlistLoaded = true;
  }
        // Create Re-usable twitch stream
  loadTwitchStream(work) {
    this.twitchStreamDiv = document.createElement('div');
    this.twitchStreamDiv.setAttribute('id', 'twitch-stream');
    this.twitchStreamDiv.classList.add('stream-work');
    this.concertDiv.appendChild(this.twitchStreamDiv);
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
      // channel: this.twitchChannel,
      channel: "lsuemdm_duo",
      // channel: "lsuemdm",
      // video: "",
      // collection: "",
      parent: ["emdm.io", "concert.emdm.io", 'live.emdm.io']
    };
  
    let player = new Twitch.Player("twitch-stream", options);
    player.addEventListener(Twitch.Player.READY, ()=>{
      player.setVolume(0.8);
      let vol = player.getVolume();
      console.log("volume = ", vol);
      // let textDiv = document.getElementById('stream-text');
      // textDiv.classList.add('bottom');
      // textDiv.innerHTML = `Player Volume is ${vol}`
      // textDiv.innerHTML = `The performance begins at 23:15 UTC+1 (5:15 CDT, 3:15 PDT)`
      // textDiv.innerHTML = `EMDM Live Stream`
    });
    // work.stream = player;

    return player
  }

  setTwitchChannel(channel){
    // may not need this...
    this.twitchStream.setChannel(channel);
  }

  loadYoutubeStream(work) {
    this.youtubeStreamDiv = document.createElement('div');
    this.youtubeStreamDiv.setAttribute('id', 'twitch-stream');
    this.youtubeStreamDiv.classList.add('stream-work');
    this.concertDiv.appendChild(this.youtubeStreamDiv);
    return true;
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


// ***************************************************************************
// *** General Concert Functions

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
    } else if (work.type == 'stream' || work.service) {
      work.stream ? work.stream.setVolume(gain) : null;
    } else if (work.type == 'audio'){
      work.wave.setVolume(gain);
    } else if (work.type == 'glass'){
      work.gain.gain.rampTo(gain, 0.03);
      work.stream ? work.stream.setVolume(gain) : null;
    } else if (work.type == 'mcluhen'){
      // work.gain.gain.rampTo(gain, 0.03);
      work.stream ? work.stream.setVolume(gain) : null;
    } else if (work.service){
      work.stream ? work.stream.setVolume(gain) : null;
    }
  }

  playArtistTalk(artistTalk, play) {
    let work = this.getWork(artistTalk);
    if(play && work.artistTalkDiv.paused){
      work.artistTalkDiv.classList.add('artist-speaks');
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

  stageWork(workId, stage) {
    // Stage and unstage works
    console.log(workId, stage);   // drip, true
    let artwork = this.getWork(workId);
    if (artwork != undefined) {
      if(stage==false || (stage==undefined && artwork.staged)) {  // *************** UnStage the Work
        artwork.div.classList.remove('staged');
        artwork.titleDiv.classList.remove('titleTop');
        if(artwork.style) {
          for (let style in artwork.originalStyle) {
            artwork.div.style[style] = artwork.originalStyle[style];
          }
        }
        if(artwork.type == 'audio' || artwork.wave != undefined ){    // Unstage Audio
          if(artwork.image != undefined){
            artwork.waveDiv.classList.remove('bottom', 'center', 'staged-work-opacity');
            artwork.waveDiv.classList.add('bottom');
          } else {
            artwork.waveDiv.classList.remove('staged-work-opacity');
          }
          setTimeout((artwork)=>{artwork.wave.drawBuffer()}, 3000, artwork)
        } else if (artwork.type == 'video') {
          artwork.titleDiv.classList.remove('titleTop');
          artwork.videoDiv.classList.remove('staged-work-opacity');
        } else if (artwork.type == 'stream' ) {
          if (!standalone && artwork.qAndA) { artwork.questionDiv.classList.remove('bottom', 'fixed')}
          artwork.titleDiv.classList.remove('titleBottomRight');
          artwork.streamDiv.classList.remove('stream');
        } else if (artwork.type == 'glass'){
          document.getElementById(artwork.glassDiv).classList.remove('live');
          document.getElementById('main-display').classList.remove('live');

          if (!standalone && artwork.qAndA) {artwork.questionDiv.classList.remove('bottom', 'fixed');}
          artwork.titleDiv.classList.remove('titleBottomRight');
          if (artwork.name=='glass-harp') {
            this.twitchStreamDiv.classList.remove('glass');
          }
          if(artwork.service) {
            artwork.streamDiv.classList.remove('stream');
          }
        } else if (artwork.type == 'mcluhen') {
          if (!standalone && artwork.qAndA) {artwork.questionDiv.classList.remove('bottom', 'fixed');}
          // artwork.titleDiv.classList.add('titleBottomRight');
          artwork.streamDiv.classList.remove('stream');
          if (artwork.name=='mcluhen') {
            this.twitchStreamDiv.classList.remove('mcluhen');
          }
          // artwork.stream.mute();
        }
        
        this.currentWork = null;
        artwork.staged = false;
      } else {                            // ************************************** Stage the work
        artwork.div.classList.add('staged');
        if(artwork.type == 'audio' || artwork.wave != undefined ){
          if(artwork.image != undefined){
            artwork.titleDiv.classList.add('titleTop');
            artwork.waveDiv.classList.add('bottom', 'staged-work-opacity');
          } else {
            artwork.titleDiv.classList.add('titleTop');
            artwork.waveDiv.classList.add('center', 'staged-work-opacity');
          }
          setTimeout((artwork)=>{artwork.wave.drawBuffer()}, 3000, artwork)
        } else if (artwork.type == 'video') {
          artwork.titleDiv.classList.add('titleTop');
          artwork.videoDiv.classList.add('staged-work-opacity');
        } else if (artwork.type == 'stream') {
          if (!standalone && artwork.qAndA) {artwork.questionDiv.classList.add('bottom', 'fixed');}
          artwork.titleDiv.classList.add('titleBottomRight');
          artwork.streamDiv.classList.add('stream');
          // artwork.stream.mute();
        } else if (artwork.type == 'glass'){
          console.log('Stage Glass!!!!!!!!!!!')
          if(!artwork.glassLoaded || artwork.name != glass.currentWork) {
            console.log("load them glassworks")
            let glassClips = eval(artwork.glassPlaylist);
            console.log('glassClips', glassClips, artwork.glassDiv)
            glass.loadVideos(glassClips, artwork.glassDiv, artwork.gain);  // playlist, div-ID, external gain node
            artwork.glassLoaded = true;
          }
          document.getElementById(artwork.glassDiv).classList.add('live');
          document.getElementById('main-display').classList.add('live');

          if (!standalone && artwork.qAndA) {artwork.questionDiv.classList.add('bottom', 'fixed');}
          artwork.titleDiv.classList.add('titleBottomRight');
          if (artwork.name=='glass-harp') {
            this.twitchStreamDiv.classList.add('glass');
          }
          if(artwork.service) {
            artwork.streamDiv.classList.add('stream');
          }
        } else if (artwork.type == 'mcluhen') {
          if (!standalone && artwork.qAndA) {artwork.questionDiv.classList.add('bottom', 'fixed');}
          // artwork.titleDiv.classList.add('titleBottomRight');
          artwork.streamDiv.classList.add('stream');
          if (artwork.name=='mcluhen') {
            this.twitchStreamDiv.classList.add('mcluhen');
          }
          // artwork.stream.mute();
        }



          // Apply Generic styles  -- may want to dynamically set up a class someday. Then just add and remove that.
        // if(artwork.style) {
        //   for (let style in artwork.style) {
        //     let ostyle = artwork.div.style[style] ? artwork.div.style[style] : ''; 
        //     artwork.originalStyle[style] = ostyle;      // Store original css styles
        //     artwork.div.style[style] = artwork.style[style];
        //   }
        // }
        this.currentWork = artwork.name;
        artwork.staged = stage;
      }
    } else {
      hub.log('No work with name or id of ', workId);
    }
  }

}


