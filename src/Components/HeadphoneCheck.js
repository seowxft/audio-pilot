import React from "react";
import { Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";

import audioCalib from "./audio/headphone/noise_calib_stim.wav";
import audioCheck1 from "./audio/headphone/antiphase_HC_ISO.wav";
import audioCheck2 from "./audio/headphone/antiphase_HC_IOS.wav";
import audioCheck3 from "./audio/headphone/antiphase_HC_SOI.wav";
import audioCheck4 from "./audio/headphone/antiphase_HC_SIO.wav";
import audioCheck5 from "./audio/headphone/antiphase_HC_OSI.wav";
import audioCheck6 from "./audio/headphone/antiphase_HC_OIS.wav";

import * as SliderVol from "./VolumeSlider.js";

import styles from "./style/taskStyle.module.css";

import PlayButton from "./PlayButton";
import { DATABASE_URL } from "./config";

////////////////////////////////////////////////////////////////////////////////
//Functions
////////////////////////////////////////////////////////////////////////////////
//for volume, it is in log scale
function logslider(position) {
  // position will be between 0 and 100
  var minp = 0;
  var maxp = 100;

  // The bounds of the slider
  var minv = Math.log(1);
  var maxv = Math.log(100);

  // calculate adjustment factor
  var scale = (maxv - minv) / (maxp - minp);

  return Math.exp(minv + scale * (position - minp));
}

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

////////////////////////////////////////////////////////////////////////////////
//React Component
////////////////////////////////////////////////////////////////////////////////
class HeadphoneCheck extends React.Component {
  constructor(props) {
    super(props);
    // Constructor and props
    const userID = this.props.location.state.userID;
    const date = this.props.location.state.date;
    const startTime = this.props.location.state.startTime;

    var quizSounds = [
      audioCheck1,
      audioCheck2,
      audioCheck3,
      audioCheck4,
      audioCheck5,
      audioCheck6,
    ];

    var varPlayColour = [
      "#bf0069",
      "#395756",
      "#4f5d75",
      "#4d8f1e",
      "#188fa7",
      "#7261a3",
    ];

    var quizAns = [2, 3, 1, 1, 2, 3];

    shuffleSingle(varPlayColour);
    shuffleDouble(quizSounds, quizAns);
    var currTime = Math.round(performance.now());
    var volNtLog = 80;
    var vol = logslider(80);

    ////////////////////////////////////////////////////////////////////////////////
    //Set state
    ////////////////////////////////////////////////////////////////////////////////
    this.state = {
      userID: userID,
      date: date,
      startTime: startTime,

      checkStage: 1,
      currentInstructionText: 1,
      quizScreen: false,

      qnNumTotal: 6,
      qnNum: 1,

      qnTime: currTime,
      qnRT: 0,
      qnPressKey: [],
      qnCorr: [],
      quizAns: quizAns,
      quizSum: 0,
      quizPer: 0,
      quizSoundsIndiv: null,
      quizAnsIndiv: null,

      active: false,
      playOnceOnly: false,
      playNum: false,

      varPlayColour: varPlayColour,
      calibSound: audioCalib,
      quizSounds: quizSounds,
      volume: vol, // this is what i feed into the audio
      volumeNotLog: volNtLog, //this is what you feed into the slider and convert back
      checkTry: 1,
    };

    /* prevents page from going down when space bar is hit .*/
    window.addEventListener("keydown", function (e) {
      if (e.keyCode === 32 && e.target === document.body) {
        e.preventDefault();
      }
    });

    this.togglePlaying = this.togglePlaying.bind(this);
    this.handleInstructionsLocal = this.handleInstructionsLocal.bind(this);
    this.redirectToTarget = this.redirectToTarget.bind(this);
    this.redirectToBack = this.redirectToBack.bind(this);
    this.display_question = this.display_question.bind(this);
  }
  ////////////////////////////////////////////////////////////////////////////////
  //Constructor and props end
  ////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////////
  //Instruction Screen
  ////////////////////////////////////////////////////////////////////////////////
  handleInstructionsLocal(event) {
    var curText = this.state.currentInstructionText;
    var whichButton = event.currentTarget.id;

    if (whichButton === "left" && curText > 1) {
      this.setState({ currentInstructionText: curText - 1 });
    } else if (whichButton === "right" && curText < 3) {
      this.setState({ currentInstructionText: curText + 1 });
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  //After audio calibration, move to headphone check instruction screen
  ////////////////////////////////////////////////////////////////////////////////
  nextStage() {
    this.setState({
      checkStage: 2,
      currentInstructionText: 1,
      quizScreen: false,
    });
  }

  ////////////////////////////////////////////////////////////////////////////////
  //Start headphone check
  ////////////////////////////////////////////////////////////////////////////////
  start_quest() {
    var currTime = Math.round(performance.now());
    console.log("quizAns: " + this.state.quizAns);

    this.setState({
      quizScreen: true,
      qnNum: 1,
      qnTime: currTime,
      playOnceOnly: true, //change this to true make sure sounds can only play once for the quiz
      playNum: false,
      active: false,
    });
  }

  ////////////////////////////////////////////////////////////////////////////////
  //Toggle audio playing
  ////////////////////////////////////////////////////////////////////////////////
  togglePlaying() {
    console.log("PlayNum :" + this.state.playNum);
    console.log("Playing :" + this.state.active);

    if (this.state.playOnceOnly === true) {
      //if this is a section where playOnceOnly happens then
      if (this.state.playNum === false) {
        //if it's the first play,
        this.setState({ active: !this.state.active, playNum: true });
        document.addEventListener("keydown", this._handleKeyDownNumbers);
      } else {
        //if played once then stop
        this.setState({ active: false });
      }
    } else {
      this.setState({ active: !this.state.active });
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  //Callback functions to set volume before headphone check
  ////////////////////////////////////////////////////////////////////////////////

  callbackVol(callBackValue) {
    var volume = callBackValue;

    if (volume > 100) {
      volume = 100;
    } else if (volume < 0) {
      volume = 1;
    }

    this.setState({ volume: volume });
    console.log("Vol in Log: " + volume);
  }

  callbackVolNotLog(callBackValueNotLog) {
    var volumeNotLog = callBackValueNotLog;

    this.setState({ volumeNotLog: volumeNotLog });
    console.log("vol not in Log: " + volumeNotLog);
  }

  ////////////////////////////////////////////////////////////////////////////////
  //Question display for headphone check
  ////////////////////////////////////////////////////////////////////////////////
  display_question(qnNum) {
    //comment this out after debuging, it will make sure that you can only cont when after you play the sound
    //document.addEventListener("keydown", this._handleKeyDownNumbers);
    var audioBite = this.state.quizSounds[qnNum - 1];

    return (
      <div className={styles.quiz}>
        <p>
          <span className={styles.center}>
            <strong>
              Question {qnNum} of {this.state.qnNumTotal}
            </strong>
          </span>
          <br />
          When you click the play button below, you will hear three sounds
          separated by silences.
          <br />
          <br />
          Test sounds can only be played <strong>once</strong>, so do pay
          attention!
          <br />
          <br />
          <span className={styles.centerTwo}>
            <PlayButton
              audio={audioBite}
              play={this.togglePlaying}
              stop={this.togglePlaying}
              idleBackgroundColor={this.state.varPlayColour[qnNum - 1]}
              {...this.state}
            />
            <br />
            <br />
            Which sound was the <strong>softest</strong> (quietest) -- 1, 2, or
            3?
            <br /> <br />
            <strong>1</strong> - FIRST sound was SOFTEST <br />
            <strong>2</strong> - SECOND sound was SOFTEST <br />
            <strong>3</strong> - THIRD sound was SOFTEST <br />
            <br />
            [Press the correct number key]
            <br /> <br />{" "}
            <span className={styles.smallfont}>
              [Note: Number keys will not work unless you click the play
              button.]
            </span>
          </span>
        </p>
      </div>
    );
  }

  ////////////////////////////////////////////////////////////////////////////////
  //When answer the quiz, record and calculate quiz score and key presses
  ////////////////////////////////////////////////////////////////////////////////
  next_question(pressed, time_pressed) {
    this.useEffect();
    document.removeEventListener("keydown", this._handleKeyDownNumbers);

    var qnRT = time_pressed - this.state.qnTime;
    var qnNum = this.state.qnNum;
    var quizSum = this.state.quizSum;
    var qnPressKey = this.state.qnPressKey;
    var qnCorr = this.state.qnCorr;
    var qnCorrIndiv = this.state.qnCorrIndiv;
    var quizAns = this.state.quizAns;
    var quizPer = this.state.quizPer;
    var qnNumTotal = this.state.qnNumTotal;

    var qnNumIdx = qnNum - 1;

    // Check answers if correct
    if (
      (qnNum === 1 && pressed === quizAns[0]) ||
      (qnNum === 2 && pressed === quizAns[1]) ||
      (qnNum === 3 && pressed === quizAns[2]) ||
      (qnNum === 4 && pressed === quizAns[3]) ||
      (qnNum === 5 && pressed === quizAns[4]) ||
      (qnNum === 6 && pressed === quizAns[5])
    ) {
      qnCorr[qnNumIdx] = 1;
      qnCorrIndiv = 1;
      quizSum = quizSum + 1;
    } else {
      qnCorr[qnNumIdx] = 0;
      qnCorrIndiv = 0;
    }

    console.log("Qn correct: " + qnCorr);
    console.log("Total quiz score: " + quizSum);
    qnPressKey = pressed;

    quizPer = (qnNum / qnNumTotal) * 100;

    this.setState({
      qnNum: qnNum,
      quizPer: quizPer,
      quizSum: quizSum,
      qnPressKey: qnPressKey,
      qnRT: qnRT,
      qnCorr: qnCorr,
      qnCorrIndiv: qnCorrIndiv,
    });

    setTimeout(
      function () {
        this.saveData();
      }.bind(this),
      10
    );
  }

  ////////////////////////////////////////////////////////////////////////////////
  //Save data
  ////////////////////////////////////////////////////////////////////////////////
  saveData() {
    var userID = this.state.userID;
    var currTime = Math.round(performance.now());
    let quizbehaviour;
    if (this.state.checkStage === 1) {
      quizbehaviour = {
        userID: this.state.userID,
        date: this.state.date,
        startTime: this.state.startTime,
        checkTry: this.state.checkTry,
        checkStage: this.state.checkStage,
        qnTime: this.state.qnTime,
        qnRT: currTime - this.state.qnRT,
        qnNum: 1,
        volume: this.state.volume,
        volumeNotLog: this.state.volumeNotLog,
        quizSoundsIndiv: null,
        quizAnsIndiv: null,
        qnPressKey: null,
        qnCorrIndiv: null,
      };

      fetch(`${DATABASE_URL}/headphone_check/` + userID, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizbehaviour),
      });

      console.log(quizbehaviour);

      setTimeout(
        function () {
          this.nextStage();
        }.bind(this),
        10
      );
    } else {
      quizbehaviour = {
        userID: this.state.userID,
        checkTry: this.state.checkTry,
        checkStage: this.state.checkStage,
        qnTime: this.state.qnTime,
        qnRT: this.state.qnRT,
        qnNum: this.state.qnNum,
        volume: this.state.volume,
        volumeNotLog: this.state.volumeNotLog,
        quizSoundsIndiv: this.state.quizSounds[this.state.qnNum - 1],
        quizAnsIndiv: this.state.quizAns[this.state.qnNum - 1],
        qnPressKey: this.state.qnPressKey,
        qnCorrIndiv: this.state.qnCorrIndiv,
      };

      fetch(`${DATABASE_URL}/headphone_check/` + userID, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizbehaviour),
      });

      console.log(quizbehaviour);

      setTimeout(
        function () {
          this.nextQn();
        }.bind(this),
        10
      );
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  //Move to next question for headphone check
  ////////////////////////////////////////////////////////////////////////////////
  nextQn() {
    var qnNum = this.state.qnNum + 1;
    var currTime = Math.round(performance.now());

    this.setState({
      qnNum: qnNum,
      qnTime: currTime,
      active: false,
      playNum: false, //reset so next question can play once
      playOnceOnly: true, //change this to make sure sounds can only play once for the quiz
      quizSoundsIndiv: null,
      quizAnsIndiv: null,
    });
  }

  ////////////////////////////////////////////////////////////////////////////////
  //Functions for keypresses
  ////////////////////////////////////////////////////////////////////////////////
  _handleKeyDownNumbers = (event) => {
    var pressed;
    var time_pressed;

    switch (event.keyCode) {
      case 49:
        pressed = 1;
        time_pressed = Math.round(performance.now());
        this.next_question(pressed, time_pressed);

        break;
      case 50:
        pressed = 2;
        time_pressed = Math.round(performance.now());
        this.next_question(pressed, time_pressed);

        break;
      case 51:
        pressed = 3;
        time_pressed = Math.round(performance.now());
        this.next_question(pressed, time_pressed);
        break;

      default:
    }
  };

  ////////////////////////////////////////////////////////////////////////////////
  //Reset from beginning if fail headphone check
  ////////////////////////////////////////////////////////////////////////////////
  redirectToBack() {
    var checkTry = this.state.checkTry + 1;
    var vol = logslider(80);
    this.setState({
      checkTry: checkTry,
      checkStage: 1,
      currentInstructionText: 1,
      quizScreen: false,
      qnNum: 1,
      qnTime: 0,
      quizSum: 0,
      qnPressKey: [],
      qnCorr: [],
      active: false,
      volume: vol,
      volumeNotLog: 80,
    });
    setTimeout(
      function () {
        this.resetSounds();
      }.bind(this),
      0
    );
  }

  ////////////////////////////////////////////////////////////////////////////////
  //If fail headphone check, reset the sounds for another try
  ////////////////////////////////////////////////////////////////////////////////
  resetSounds() {
    var quizSounds = this.state.quizSounds;
    var quizAns = this.state.quizAns;
    var varPlayColour = this.state.PlayColour;

    shuffleSingle(varPlayColour);
    shuffleDouble(quizSounds, quizAns);

    this.setState({
      quizSounds: quizSounds,
      quizAns: quizAns,
      varPlayColour: varPlayColour,
      quizSoundsIndiv: null,
      quizAnsIndiv: null,
    });
  }

  ////////////////////////////////////////////////////////////////////////////////
  //Function to ensure that the page starts from the top
  ////////////////////////////////////////////////////////////////////////////////
  useEffect() {
    window.scrollTo(0, 0);
  }

  ////////////////////////////////////////////////////////////////////////////////
  //Component mount
  ////////////////////////////////////////////////////////////////////////////////
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  ////////////////////////////////////////////////////////////////////////////////
  //Move to next section of task
  ////////////////////////////////////////////////////////////////////////////////
  redirectToTarget() {
    this.props.history.push({
      pathname: `/AudioFreq`,
      state: {
        userID: this.state.userID,
        date: this.state.date,
        startTime: this.state.startTime,
        volume: this.state.volume,
        volumeNotLog: this.state.volumeNotLog,
      },
    });
  }

  ////////////////////////////////////////////////////////////////////////////////
  //Rendering
  ////////////////////////////////////////////////////////////////////////////////
  render() {
    let text;

    if (this.state.checkStage === 1) {
      //this is to adjust sound volume
      if (this.state.currentInstructionText === 1) {
        this.useEffect();
        text = (
          <div className={styles.main}>
            <p>
              <span className={styles.center}>
                <strong>WELCOME</strong>
              </span>
              <br />
              Today, we would like your help in evaluating some sounds.
              <br />
              <br />
              To do this, you should be in a quiet environment, and you must{" "}
              <br />
              be wearing either headphones or earphones throughout the session.
              <br /> <br />
              Please put on your headphones or earphones.
              <br /> <br />
              When you are ready, click <strong>NEXT</strong>.
              <br />
              <span className={styles.center}>
                <br />
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
                <strong>ADJUST AUDIO SETTINGS</strong>{" "}
              </span>
              <br />
              Great! First, we need to set your sound settings to an appropriate
              level. <br />
              Please set your computer system volume level to{" "}
              <strong>30% of the maximum</strong>.
              <br /> <br />
              Now, click the play button below.
              <br />
              <br />
              <span className={styles.center}>
                <PlayButton
                  audio={this.state.calibSound}
                  play={this.togglePlaying}
                  stop={this.togglePlaying}
                  {...this.state}
                />
              </span>
              <br />
              If it is too loud or soft, adjust the volume on the slider below.
              <br />
              You can click the play button as many times as you like.
              <br />
              <br />
              You should aim for a loud but comfortable level.
              <br /> <br />
              <span className={styles.center}>
                <SliderVol.SliderVol
                  callBackValue={this.callbackVol.bind(this)}
                  callBackValueNotLog={this.callbackVolNotLog.bind(this)}
                />
              </span>
              <br />
              Click <b>NEXT</b> when you are happy with the sound level.
              <span className={styles.center}>
                <br />
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
                  onClick={this.saveData.bind(this)}
                >
                  NEXT
                </Button>
              </span>
            </p>
          </div>
        );
      }
    } else if (this.state.checkStage === 2) {
      this.useEffect();
      // this is the 3 sound quiz
      if (this.state.quizScreen === false) {
        text = (
          <div className={styles.main}>
            <p>
              <span className={styles.center}>
                <strong>AUDIO SCREENING</strong>
              </span>
              <br />
              You will now complete an audio screening task.
              <br />
              <br />
              It is important that you keep your headphones on, <br />
              and do not adjust your sound settings.
              <br />
              <br />
              You will need to pass this quiz in order to proceed further.
              <br />
              <br />
              Click <strong>START</strong> to begin.
              <br /> <br />
              <span className={styles.center}>
                <Button type="button" onClick={() => this.start_quest()}>
                  START
                </Button>
              </span>
            </p>
          </div>
        );
      } else {
        //QUIZ STARTS
        if (this.state.qnNum <= this.state.qnNumTotal) {
          text = (
            <div className="questionnaire">
              <center>
                <br />
                {this.display_question(this.state.qnNum)}
                <br />
              </center>
            </div>
          );
        } else {
          // If finish questionnaire, stop listener and calculate quiz score
          document.removeEventListener("keydown", this._handleKeyDownEnter);
          if (this.state.quizSum > this.state.qnNumTotal - 2) {
            this.redirectToTarget();
          } else {
            text = (
              <div className={styles.main}>
                <p>
                  <span className={styles.center}>
                    <strong>END AUDIO CHECK</strong>
                  </span>
                  <br />
                  <br />
                  Sorry, you failed the screening test.
                  <br />
                  <br />
                  You scored {this.state.quizSum} out of {this.state.qnNumTotal}{" "}
                  questions correctly.
                  <br />
                  <br />
                  Please ensure that you are wearing headphones/earphones and
                  calibrate a louder audio volume.
                  <br />
                  <br />
                  Click the button below to calibrate the volume again.
                  <br />
                  <br />
                  <span className={styles.center}>
                    <Button type="button" onClick={() => this.redirectToBack()}>
                      RECALIBRATE
                    </Button>
                  </span>
                </p>
              </div>
            );
          }
        }
      }
    }
    return <div>{text}</div>;
  }
}

export default withRouter(HeadphoneCheck);
