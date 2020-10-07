import React from "react";
import { Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import styles from "./style/taskStyle.module.css";

import sound1 from "./audio/pilot/alexanderwendt_dentistDrill_500.wav";
import sound2 from "./audio/pilot/bacigalupo_whitenoise_1500.wav";
import sound3 from "./audio/pilot/browniannoise_08amp_1500.wav";
import sound4 from "./audio/pilot/morriss_scream_1000.wav";
import sound5 from "./audio/pilot/pinknoise_08amp_1500.wav";
import sound6 from "./audio/pilot/zaldPardo_highfreq_1500.wav";
import sound7 from "./audio/pilot/zaldPardo_metalscreech_1500.wav";
// import sound8 from "./audio/pilot/250hz_sinetone_08amp_1500.wav";
// import sound9 from "./audio/pilot/400hz_sinetone_08amp_1500.wav";
import sound10 from "./audio/pilot/800hz_sinetone_08amp_1500.wav";

import * as RatingSlider from "./RatingSlider.js";
import PlayButton from "./PlayButton";

import Tone from "react-tone";

import Play from "./Play";
import Pause from "./Pause";
import { DATABASE_URL } from "./config";

//shuffleSingle
function shuffleSingle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Function to shuffle Audio and Answers
function shuffleDouble(fileNames, trackTitles) {
  var tempA;
  var tempB;
  for (var a = 0; a < fileNames.length; a++) {
    tempA = fileNames[a];
    tempB = Math.floor(Math.random() * fileNames.length);
    fileNames[a] = fileNames[tempB];
    fileNames[tempB] = tempA;

    tempA = trackTitles[a];
    trackTitles[a] = trackTitles[tempB];
    trackTitles[tempB] = tempA;
  }
}

//array of certain length within a certain range
function randomArray(length, min, max) {
  let range = max - min + 1;
  return Array.apply(null, Array(length)).map(function () {
    return Math.round(Math.random() * range) + min;
  });
}

class AudioPilot extends React.Component {
  constructor(props) {
    super(props);

    const userID = this.props.location.state.userID;
    const volume = this.props.location.state.volume * 10;
    const sliderFreq = this.props.location.state.sliderFreq;
    const volMod = this.props.location.state.volMod;

    var currentDate = new Date();

    var lowerVol = volume / 2;
    var FreqVol = volume * volMod;
    var lowerFreqVol = FreqVol / 2;

    console.log("sliderFreq" + sliderFreq);
    console.log("volMod" + volMod);
    console.log("volume" + volume);
    console.log("FreqVol" + FreqVol);

    var varPlayColour = [
      "#d02f33",
      "#cd5a7e",
      "#49458d",
      "#c17860",
      "#19cdc4",
      "#430031",
      "#21d770",
      "#948082",
      "#bfafed",
      "#b6c8a9",
      "#0e0399",
      "#d16ab1",
      "#3f0d9a",
      "#c42557",
      "#8e63a0",
      "#706804",
      "#435f07",
      "#8050a9",
      "#0f46e1",
      "#197cab",
      "#9a287c",
      "#b20d44",
      "#0a286a",
      "#e5af2d",
      "#ed3e92",
    ];

    var sounds = [
      sound1,
      sound2,
      sound3,
      sound4,
      sound5,
      sound6,
      sound7,
      sound10,
    ];

    var totalSoundNum = sounds.length;

    var soundArray = sounds.concat(sounds);
    var soundVolTemp = Array(totalSoundNum)
      .fill(volume)
      .concat(Array(totalSoundNum).fill(lowerVol));
    var soundVol = soundVolTemp
      .concat(Array(3).fill(FreqVol))
      .concat(Array(3).fill(lowerFreqVol));

    // shuffleDouble(soundArray, soundVol);
    shuffleSingle(varPlayColour);

    var qnNumTotal = soundArray.length + 6;
    // the last six numbers will be for the frequency
    var qnNumTotalIndex = Array.from(Array(qnNumTotal).keys());
    var freqnIndex = qnNumTotalIndex.slice(-6);

    shuffleSingle(qnNumTotalIndex);

    var averRatingDef = randomArray(qnNumTotal, 35, 65);
    var arouRatingDef = randomArray(qnNumTotal, 35, 65);

    var sliderFreq2 = sliderFreq - 250;
    var sliderFreq3 = sliderFreq - 500;

    var sliderKey = Array.from(Array(qnNumTotal * 2).keys());

    var qnTime = Math.round(performance.now());

    // This will change for the questionnaires going AFTER the main task
    this.state = {
      userID: userID,

      soundVol: soundVol,
      qnNumTotal: qnNumTotal,
      //qnNumTotal: 1,// for debug
      qnNum: 1,
      qnTime: qnTime,
      qnRT: 0,
      quizScreen: false,
      sounds: soundArray,
      currentInstructionText: 1,
      playNum: 0,

      averRatingDef: averRatingDef,
      arouRatingDef: arouRatingDef,

      qnNumTotalIndex: qnNumTotalIndex,
      freqnIndex: freqnIndex,
      soundIndex: 0,
      volume: 0,
      sliderKey: sliderKey,

      averRating: null,
      arouRating: null,

      active: false,
      soundFocus: null,
      freqFocus: null,
      freqSounds: [sliderFreq, sliderFreq2, sliderFreq3],
      isTonePlaying: false,
      btnDisTone: false,
      btnDisNext: true,
      toneLength: 2,
      varPlayColour: varPlayColour,
    };

    /* prevents page from going down when space bar is hit .*/
    window.addEventListener("keydown", function (e) {
      if (e.keyCode === 32 && e.target === document.body) {
        e.preventDefault();
      }
    });

    this.togglePlaying = this.togglePlaying.bind(this);
    this.handleInstructionsLocal = this.handleInstructionsLocal.bind(this);
    this.audioContext = undefined;
    this.iosAudioContextUnlocked = false;
    this.handleClick = this.handleClick.bind(this);
  }
  /// END PROPS

  handleClick = () => {
    if (!this.iosAudioContextUnlocked) this.playEmptyBuffer();
    var playNum = this.state.playNum + 1;
    this.setState({ isTonePlaying: true, playNum: playNum });
  };

  // This handles instruction screen within the component
  handleInstructionsLocal(event) {
    var curText = this.state.currentInstructionText;
    var whichButton = event.currentTarget.id;

    if (whichButton === "left" && curText > 1) {
      this.setState({ currentInstructionText: curText - 1 });
    } else if (whichButton === "right" && curText < 4) {
      this.setState({ currentInstructionText: curText + 1 });
    }
  }

  // Toggle on and off
  // togglePlay() {
  //   this.setState({ active: !this.state.active }, () => {
  //     this.state.active ? this.sound.play() : this.sound.pause();
  //   });
  // }

  togglePlaying() {
    if (this.state.active === false) {
      var playNum = this.state.playNum + 1;
      this.setState({ playNum: playNum });
    }

    this.setState({ active: !this.state.active });
  }

  start_quest() {
    var currTime = Math.round(performance.now());

    //get index of sound1
    var qnNumTotalIndex = this.state.qnNumTotalIndex;
    var soundIndex = qnNumTotalIndex[0];
    var freqnIndex = this.state.freqnIndex;
    var volume = this.state.soundVol[soundIndex];
    var soundbite = this.state.sounds[soundIndex];
    console.log("qnNumTotalIndex " + qnNumTotalIndex);
    console.log("freqnIndex " + freqnIndex);
    console.log("soundIndex " + soundIndex);
    console.log("soundVol " + this.state.soundVol);
    console.log("volume " + volume);
    console.log("soundbite " + soundbite);

    if (freqnIndex.includes(soundIndex)) {
      //if it includes, then it is a frequency noise to be played
      this.setState({
        quizScreen: true,
        qnTime: currTime,
        qnNum: 1,
        playNum: 0,
        active: false,
        volume: volume,
        soundFocus: null,
      });
    } else {
      this.setState({
        quizScreen: true,
        qnTime: currTime,
        qnNum: 1,
        playNum: 0,
        active: false,
        volume: volume,
        soundFocus: soundbite,
      });
    }
  }

  playEmptyBuffer = () => {
    // start an empty buffer with an instance of AudioContext
    const buffer = this.audioContext.createBuffer(1, 1, 22050);
    const node = this.audioContext.createBufferSource();
    node.buffer = buffer;
    node.start(0);
    this.iosAudioContextUnlocked = true;
  };

  handleToneStop = () => {
    this.setState({ isTonePlaying: false });
  };

  callbackAver(callBackValue) {
    this.setState({ averRating: callBackValue });
    if (this.state.averRating !== null && this.state.arouRating !== null) {
      this.setState({ btnDisNext: false });
    }
  }

  callbackArou(callBackValue) {
    this.setState({ arouRating: callBackValue });
    if (this.state.averRating !== null && this.state.arouRating !== null) {
      this.setState({ btnDisNext: false });
    }
  }

  ratingTask(qnNum) {
    var qnIndx = qnNum - 1;
    var averRatingDef = this.state.averRatingDef[qnIndx];
    var arouRatingDef = this.state.arouRatingDef[qnIndx];

    var freqnIndex = this.state.freqnIndex;
    var qnNumTotalIndex = this.state.qnNumTotalIndex;
    var soundIndex = qnNumTotalIndex[qnIndx];

    console.log("freqnIndex: " + freqnIndex);
    console.log("qnIndx: " + qnIndx);
    console.log("soundIndex: " + soundIndex);

    let question_text = (
      <div className={styles.quiz}>
        <span>
          <span className={styles.center}>
            <strong>
              Sound {this.state.qnNum} of {this.state.qnNumTotal}
            </strong>
          </span>
          <br />
          Please do not adjust your volume settings.
          <br />
          You can play the sound as many times as you like!
        </span>
      </div>
    );

    if (freqnIndex.includes(soundIndex)) {
      var volume = this.state.volume / 100;
      var freqArrayIdx = freqnIndex.indexOf(soundIndex);
      var freqSounds = this.state.freqSounds[freqArrayIdx];

      var question_text1 = (
        <div>
          <span className={styles.playTri}>
            {this.state.isTonePlaying && !this.state.btnDisTone ? (
              <Pause onPlayerClick={this.handleClick} />
            ) : (
              <Play onPlayerClick={this.handleClick} />
            )}
          </span>
          <Tone
            audioContext={this.audioContext}
            play={this.state.isTonePlaying}
            frequency={freqSounds}
            volume={volume}
            length={this.state.toneLength}
            onStop={this.handleToneStop}
          />
        </div>
      );
    } else {
      // if the index is not for the frequencies that wee chosen before...
      var question_text1 = (
        <div>
          <span className={styles.centerTwo}>
            <PlayButton
              audio={this.state.soundFocus}
              play={this.togglePlaying}
              stop={this.togglePlaying}
              volume={this.state.volume}
              idleBackgroundColor={this.state.varPlayColour[qnIndx]}
              active={this.state.active}
            />
            <br />
          </span>{" "}
        </div>
      );
    }

    let question_text2 = (
      <div className={styles.quiz}>
        <span className={styles.centerTwo}>
          <strong>Q{this.state.qnNum}a:</strong> How positive/negative is this
          sound?
          <br />
          <br />
          <RatingSlider.AverSlider
            key={this.state.sliderKey[qnIndx]}
            callBackValue={this.callbackAver.bind(this)}
            initialValue={averRatingDef}
          />
          <br />
          <br />
          <br />
          <strong>Q{this.state.qnNum}b:</strong> How arousing is this sound?
          <br />
          <br />
          <RatingSlider.ArouSlider
            key={this.state.sliderKey[qnIndx + this.state.qnNumTotal]}
            callBackValue={this.callbackArou.bind(this)}
            initialValue2={arouRatingDef}
          />
          <br />
          <br /> <br />
          <span className={styles.smallfont}>
            [Note: You must <strong>drag</strong> (not click) all sliders at
            least once to click NEXT.]
          </span>
          <br />
          <br />
          <Button
            id="right"
            className={styles.clc}
            disabled={this.state.btnDisNext}
            onClick={this.saveData.bind(this)}
          >
            NEXT
          </Button>{" "}
        </span>
      </div>
    );

    return (
      <div>
        {question_text}
        {question_text1}
        {question_text2}
      </div>
    );
  }

  saveData() {
    var qnRT = Math.round(performance.now()) - this.state.qnTime;
    var userID = this.state.userID;
    let quizbehaviour = {
      userID: this.state.userID,
      qnTime: this.state.qnTime,
      qnRT: qnRT,
      qnNum: this.state.qnNum,
      soundIndex: this.state.soundIndex,
      soundFocus: this.state.soundFocus,
      freqFocus: this.state.freqFocus,
      volume: this.state.volume,
      playNum: this.state.playNum,
      averRating: this.state.averRating,
      arouRating: this.state.arouRating,

      averRatingDef: this.state.averRatingDef[this.state.qnNum - 1],
      arouRatingDef: this.state.arouRatingDef[this.state.qnNum - 1],
    };

    fetch(`${DATABASE_URL}/audio_pilot/` + userID, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizbehaviour),
    });

    console.log(quizbehaviour);

    //lag a bit to make sure statestate is saved
    setTimeout(
      function () {
        this.quizNext();
      }.bind(this),
      10
    );
  }

  quizNext() {
    var qnNum = this.state.qnNum + 1;
    var qnTime = Math.round(performance.now()); //for the next question

    var qnNumTotalIndex = this.state.qnNumTotalIndex;
    var soundIndex = qnNumTotalIndex[qnNum - 1];
    var freqnIndex = this.state.freqnIndex;
    var soundbite = this.state.sounds[soundIndex];
    var volume = this.state.soundVol[soundIndex];

    this.useEffect();

    if (freqnIndex.includes(soundIndex)) {
      var freqArrayIdx = freqnIndex.indexOf(soundIndex);
      var freqSounds = this.state.freqSounds[freqArrayIdx];
      //if it is a frequencysound
      this.setState({
        qnNum: qnNum,
        qnTime: qnTime,
        soundIndex: soundIndex,
        freqFocus: freqSounds,
        volume: volume,
        playNum: 0,
        averRating: null,
        arouRating: null,

        btnDisNext: true,
        btnDisTone: false,
        active: false,
        soundFocus: null,
      });
    } else {
      this.setState({
        qnNum: qnNum,
        qnTime: qnTime,
        soundIndex: soundIndex,
        freqFocus: null,
        volume: volume,
        playNum: 0,
        averRating: null,
        arouRating: null,

        btnDisNext: true,
        btnDisTone: false,
        active: false,
        soundFocus: soundbite,
      });
    }
  }

  // Mount the component to call the BACKEND and GET the information
  componentDidMount() {
    window.scrollTo(0, 0);
    this.audioContext = new AudioContext();
  }

  useEffect() {
    window.scrollTo(0, 0);
  }

  // Push to next page
  redirectToTarget() {
    this.props.history.push({
      pathname: `/Questionnaires`,
      state: { userID: this.state.userID },
    });
  }

  render() {
    let text;
    if (this.state.quizScreen === false) {
      this.useEffect();
      if (this.state.currentInstructionText === 1) {
        text = (
          <div className={styles.main}>
            <p>
              <span className={styles.center}>
                <strong>AUDIO TEST: PART II</strong>
              </span>
              <br />
              Good job!
              <br />
              <br />
              For the next section, we present you with a variety of sound
              bites.
              <br />
              <br />
              All you have to do is to listen to them and rate the extent <br />
              to which they made you feel on some scales.
              <br /> <br />
              There are 2 scales:
              <br />
              1) <strong>valence</strong>: on scale of pleasant to unpleasant
              <br />
              2) <strong>arousal</strong>: on scale of sleepy to awake <br />
              <br />
              <br />
              <span className={styles.center}>
                <Button
                  id="right"
                  className={styles.clc}
                  onClick={this.handleInstructionsLocal}
                >
                  NEXT
                </Button>
              </span>
            </p>
          </div>
        );
      } else if (this.state.currentInstructionText === 2) {
        text = (
          <div className={styles.main}>
            <p>
              <span className={styles.center}>
                <strong>AUDIO TEST: PART II</strong>
              </span>
              <br />
              When you are asked to rate the sound on the:
              <br /> <br />{" "}
              <span className={styles.centerTwo}>
                <strong>Valence</strong> scale
              </span>
              <br />
              <RatingSlider.ExampleAver />
              <br />
              <br />
              Very <strong>pleasant</strong> sounds (0 on the scale) would be
              sounds which
              <br />
              you greatly enjoy hearing, and give you feelings of happiness.
              <br />
              <br />
              In contrast, very <strong>unpleasant</strong> sounds (100 on the
              scale) would be sounds
              <br />
              you greatly dislike, that you find are annoying or bothersome.
              <br />
              <br />
              <span className={styles.center}>
                <Button
                  id="left"
                  className={styles.clc}
                  onClick={this.handleInstructionsLocal}
                >
                  BACK
                </Button>
                &nbsp;
                <Button
                  id="right"
                  className={styles.clc}
                  onClick={this.handleInstructionsLocal}
                >
                  NEXT
                </Button>
              </span>
            </p>
          </div>
        );
      } else if (this.state.currentInstructionText === 3) {
        text = (
          <div className={styles.main}>
            <p>
              <span className={styles.center}>
                <strong>AUDIO TEST: PART II</strong>
              </span>
              <br />
              When you are asked to rate the sound on the:
              <br /> <br />
              <span className={styles.centerTwo}>
                <strong>Arousal</strong> scale
              </span>
              <br />
              <RatingSlider.ExampleArou />
              <br />
              <br />
              <strong>Not arousing</strong> sounds (0 on the scale) would be
              sounds which
              <br />
              make you feel very sleepy, bored or low energy.
              <br />
              <br />
              In contrast, <strong>very arousing</strong> sounds (100 on the
              scale) would be sounds that
              <br />
              make you feel very awake, excited or high energy.
              <br />
              <br />
              <span className={styles.center}>
                <Button
                  id="left"
                  className={styles.clc}
                  onClick={this.handleInstructionsLocal}
                >
                  BACK
                </Button>
                &nbsp;
                <Button
                  id="right"
                  className={styles.clc}
                  onClick={this.handleInstructionsLocal}
                >
                  NEXT
                </Button>
              </span>
            </p>
          </div>
        );
      } else if (this.state.currentInstructionText === 4) {
        text = (
          <div className={styles.main}>
            <p>
              <span className={styles.center}>
                <strong>AUDIO TEST: PART II</strong>
              </span>
              <br />
              Remember to keep your headphones on and do not adjust your sound
              settings.
              <br />
              <br />
              Some sounds will repeat.
              <br />
              <br />
              In total, there are {this.state.qnNumTotal} sound bites to rate.
              <br />
              <br />
              When you are ready, please click <strong>START</strong> to begin.
              <br />
              <br />
              <span className={styles.center}>
                <Button
                  id="left"
                  className={styles.clc}
                  onClick={this.handleInstructionsLocal}
                >
                  BACK
                </Button>
                &nbsp;
                <Button type="button" onClick={() => this.start_quest()}>
                  START
                </Button>
              </span>
            </p>
          </div>
        );
      }
    } else {
      //this is the quiz
      //QUIZ STARTS
      if (this.state.qnNum <= this.state.qnNumTotal) {
        text = (
          <div className="questionnaire">
            <center>
              <br />
              {this.ratingTask(this.state.qnNum)}
              <br />
            </center>
          </div>
        );
      } else {
        this.redirectToTarget();
      }
    }
    return <div>{text}</div>;
  }
}

export default withRouter(AudioPilot);
