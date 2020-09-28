import React from "react";
import { Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";

import audioCalib from "./audio/headphone/noise_calib_stim-softer20db.wav";
import audioCheck1 from "./audio/headphone/antiphase_HC_ISO.wav";
import audioCheck2 from "./audio/headphone/antiphase_HC_IOS.wav";
import audioCheck3 from "./audio/headphone/antiphase_HC_SOI.wav";
import audioCheck4 from "./audio/headphone/antiphase_HC_SIO.wav";
import audioCheck5 from "./audio/headphone/antiphase_HC_OSI.wav";
import audioCheck6 from "./audio/headphone/antiphase_HC_OIS.wav";

import * as SliderVol from "./VolumeSlider.js";

import styles from "./style/taskStyle.module.css";

import PlayButton from "./PlayButton";

// Function to shuffle Audio and Answers
function shuffle(fileNames, trackTitles) {
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

class HeadphoneCheck extends React.Component {
  constructor(props) {
    super(props);
    // Constructor and props
    const userID = this.props.location.state.userID;
    var quizSounds = [
      audioCheck1,
      audioCheck2,
      audioCheck3,
      audioCheck4,
      audioCheck5,
      audioCheck6,
    ];

    var varPlayColour = [
      "#008000",
      "#395756",
      "#4f5d75",
      "#b6c8a9",
      "#188fa7",
      "#7261a3",
    ];

    var quizAns = [2, 3, 1, 1, 2, 3];

    shuffle(quizSounds, quizAns);

    this.state = {
      userID: userID,
      checkStage: 1,
      currentInstructionText: 1,
      quizScreen: false,

      qnNumTotal: 6,
      qnNum: 1,

      qnTime: 0,
      qnPressKey: [],
      qnCorr: [],
      quizAns: quizAns,
      quizSum: 0,
      quizPer: 0,

      active: false,
      playOnceOnly: false,
      playNum: false,

      varPlayColour: varPlayColour,
      calibSound: audioCalib,
      quizSounds: quizSounds,
      volume: 80,
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
    // this.togglePlayCalib = this.togglePlayCalib.bind(this);
    // this.togglePlayHeadphone = this.togglePlayHeadphone.bind(this);
    this.redirectToTarget = this.redirectToTarget.bind(this);
    this.redirectToBack = this.redirectToBack.bind(this);
    this.display_question = this.display_question.bind(this);
  }
  // Constructor and props END

  resetSounds() {
    var quizSounds = this.state.quizSounds;
    var quizAns = this.state.quizAns;

    shuffle(quizSounds, quizAns);

    this.audioCheck1 = new Audio(quizSounds[0]);
    this.audioCheck2 = new Audio(quizSounds[1]);
    this.audioCheck3 = new Audio(quizSounds[2]);
    this.audioCheck4 = new Audio(quizSounds[3]);
    this.audioCheck5 = new Audio(quizSounds[4]);
    this.audioCheck6 = new Audio(quizSounds[5]);

    this.setState({ quizSounds: quizSounds, quizAns: quizAns });
  }

  // This handles instruction screen within the component
  handleInstructionsLocal(event) {
    var curText = this.state.currentInstructionText;
    var whichButton = event.currentTarget.id;

    if (whichButton === "left" && curText > 1) {
      this.setState({ currentInstructionText: curText - 1 });
    } else if (whichButton === "right" && curText < 3) {
      this.setState({ currentInstructionText: curText + 1 });
    }
  }

  callbackVol(callBackValue) {
    this.setState({ volume: callBackValue });
  }

  nextStage() {
    this.setState({
      checkStage: 2,
      currentInstructionText: 1,
      quizScreen: false,
    });
  }

  // Start the audio test
  start_quest() {
    var currTime = Math.round(performance.now());
    console.log("quizAns: " + this.state.quizAns);
    this.setState({
      quizScreen: true,
      qnNum: 1,
      qnTime: currTime,
      playOnceOnly: false,
      playNum: false,
    });
  }

  togglePlaying() {
    console.log("playNum :" + this.state.playNum);
    console.log("active :" + this.state.active);

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

  useEffect() {
    window.scrollTo(0, 0);
  }

  //Display question
  display_question(qnNum) {
    //comment this out after debuging, it will make sure that you can only cont when after you play the sound
    document.addEventListener("keydown", this._handleKeyDownNumbers);
    console.log("playOnceOnly: " + this.state.playOnceOnly);

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
          Test sounds can only be played once!
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
          </span>
        </p>
      </div>
    );
  }

  // After each question, move to the next one
  next_question(pressed, time_pressed) {
    this.useEffect();
    document.removeEventListener("keydown", this._handleKeyDownNumbers);
    var qnNum = this.state.qnNum;
    var quizSum = this.state.quizSum;
    var qnPressKey = this.state.qnPressKey;
    var qnTime = this.state.qnTime;
    var qnCorr = this.state.qnCorr;
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
      quizSum = quizSum + 1;
    } else {
      qnCorr[qnNumIdx] = 0;
    }

    console.log("qnCorr: " + qnCorr);
    console.log("quizSum: " + quizSum);
    qnPressKey = pressed;
    qnTime = time_pressed;

    quizPer = (qnNum / qnNumTotal) * 100;
    qnNum = qnNum + 1;

    this.setState({
      qnNum: qnNum,
      quizSum: quizSum,
      quizPer: quizPer,
      active: false,
      playNum: false, //reset so next question can play once
    });
  }

  //Handle keyboard presses

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
  // Mount the component to call the BACKEND and GET the information
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  redirectToBack() {
    var checkTry = this.state.checkTry + 1;
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
      volume: 80,
    });
    setTimeout(
      function () {
        this.resetSounds();
      }.bind(this),
      0
    );
  }

  redirectToTarget() {
    this.props.history.push({
      pathname: `/AudioFreq`,
      state: { userID: this.state.userID, volume: this.state.volume },
    });
  }

  // Render START
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
        this.useEffect();
        text = (
          <div className={styles.main}>
            <p>
              <span className={styles.center}>
                <strong>ADJUST AUDIO SETTINGS</strong>{" "}
              </span>
              <br />
              Great! First, we need to set your sound settings to an appropriate
              level. <br />
              Please set your computer system volume level to about 30% of the
              maximum.
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
              If it is too loud or soft, adjust the volume on the slider below
              <br />
              and click the play button again.
              <br />
              <br />
              You should aim for a loud but comfortable level.
              <br /> <br />
              <span className={styles.center}>
                <SliderVol.SliderVol
                  callBackValue={this.callbackVol.bind(this)}
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
                  onClick={this.nextStage.bind(this)}
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
          if (this.state.quizSum > this.state.qnNumTotal - 1) {
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
                  turn up your audio volume.
                  <br />
                  <br />
                  Click the button below to calibrate your sound settings again.
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
