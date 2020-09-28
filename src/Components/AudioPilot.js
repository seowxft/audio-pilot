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
import sound8 from "./audio/pilot/250hz_sinetone_08amp_1500.wav";
import sound9 from "./audio/pilot/400hz_sinetone_08amp_1500.wav";
import sound10 from "./audio/pilot/800hz_sinetone_08amp_1500.wav";

import * as RatingSlider from "./RatingSlider.js";
import PlayButton from "./PlayButton";

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

class EndPage extends React.Component {
  constructor(props) {
    super(props);

    const userID = this.props.location.state.userID;
    const volume = this.props.location.state.volume;
    var currentDate = new Date();

    var lowerVol = volume / 2;

    var varPlayColour = [
      "#008000",
      "#395756",
      "#4f5d75",
      "#b6c8a9",
      "#188fa7",
      "#7261a3",
      "#008000",
      "#395756",
      "#4f5d75",
      "#b6c8a9",
      "#188fa7",
      "#7261a3",
      "#008000",
      "#395756",
      "#4f5d75",
      "#b6c8a9",
      "#188fa7",
      "#7261a3",
    ];

    var sounds = [
      sound1,
      sound2,
      sound3,
      sound4,
      sound5,
      sound6,
      sound7,
      sound8,
      sound9,
      sound10,
    ];

    var totalSoundNum = sounds.length;

    var soundArray = sounds.concat(sounds);
    var soundVol = Array(totalSoundNum)
      .fill(volume)
      .concat(Array(totalSoundNum).fill(lowerVol));

    shuffleDouble(soundArray, soundVol);
    shuffleSingle(varPlayColour);

    var qnNumTotal = soundArray.length;
    var averRatingDef = randomArray(qnNumTotal, 35, 65);
    var arouRatingDef = randomArray(qnNumTotal, 35, 65);
    var valRatingDef = randomArray(qnNumTotal, 35, 65);

    // This will change for the questionnaires going AFTER the main task
    this.state = {
      userID: userID,
      volume: soundVol,
      qnNumTotal: qnNumTotal,
      qnNum: 1,
      quizScreen: false,
      sounds: soundArray,

      averRatingDef: averRatingDef,
      arouRatingDef: arouRatingDef,
      valRatingDef: valRatingDef,

      averRating: null,
      arouRating: null,
      valRating: null,
      active: false,
      soundFocus: null,

      btnDisNext: true,
      varPlayColour: varPlayColour,
    };

    /* prevents page from going down when space bar is hit .*/
    window.addEventListener("keydown", function (e) {
      if (e.keyCode === 32 && e.target === document.body) {
        e.preventDefault();
      }
    });

    this.togglePlaying = this.togglePlaying.bind(this);
  }
  /// END PROPS

  saveData() {
    var qnTime = Math.round(performance.now()) - this.state.quizTime;

    var soundVol = this.state.soundArray[this.state.qnNum - 1];

    let quizbehaviour = {
      userID: this.state.userID,
      qnTime: qnTime,
      qnNum: this.state.qnNum,
      soundFocus: this.state.soundFocus,
      soundVol: soundVol,
      averRating: this.state.averRating,
      arouRating: this.state.arouRating,
      valRating: this.state.valRating,
    };

    // fetch(`${DATABASE_URL}/data/` + fileID, {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(behaviour),
    // });

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
    var quizTime = Math.round(performance.now()); //for the next question
    var soundbite = this.state.sounds[qnNum - 1];
    this.useEffect();
    this.setState({
      qnNum: qnNum,
      quizTime: quizTime,
      averRating: null,
      arouRating: null,
      valRating: null,
      btnDisNext: true,
      active: false,
      soundFocus: soundbite,
    });
  }

  // Toggle on and off
  // togglePlay() {
  //   this.setState({ active: !this.state.active }, () => {
  //     this.state.active ? this.sound.play() : this.sound.pause();
  //   });
  // }

  togglePlaying() {
    this.setState({ active: !this.state.active });
  }

  start_quest() {
    var currTime = Math.round(performance.now());

    this.setState({
      quizScreen: true,
      qnNum: 1,
      active: false,
      qnTime: currTime,
      soundFocus: this.state.sounds[0],
    });
  }

  callbackAver(callBackValue) {
    this.setState({ averRating: callBackValue });
    if (
      this.state.averRating !== null &&
      this.state.arouRating !== null &&
      this.state.valRating !== null
    ) {
      this.setState({ btnDisNext: false });
    }
  }

  callbackArou(callBackValue) {
    this.setState({ arouRating: callBackValue });
    if (
      this.state.averRating !== null &&
      this.state.arouRating !== null &&
      this.state.valRating !== null
    ) {
      this.setState({ btnDisNext: false });
    }
  }

  callbackVal(callBackValue) {
    this.setState({ valRating: callBackValue });
    if (
      this.state.averRating !== null &&
      this.state.arouRating !== null &&
      this.state.valRating !== null
    ) {
      this.setState({ btnDisNext: false });
    }
  }

  ratingTask(qnNum) {
    var qnIndx = qnNum - 1;
    var averRatingDef = this.state.averRatingDef[qnIndx];
    var arouRatingDef = this.state.arouRatingDef[qnIndx];
    var valRatingDef = this.state.valRatingDef[qnIndx];

    // console.log("averRatingDef " + averRatingDef);
    // console.log("arouRatingDef " + arouRatingDef);
    // console.log("valRatingDef " + valRatingDef);

    let question_text = (
      <div className={styles.quiz}>
        <span>
          <span className={styles.center}>
            <strong>
              Sound {this.state.qnNum} of {this.state.qnNumTotal}
            </strong>
          </span>
          <br />
          You can play the sound as many times as you like!
          <br />
          <br />
          <span className={styles.centerTwo}>
            <PlayButton
              audio={this.state.soundFocus}
              play={this.togglePlaying}
              stop={this.togglePlaying}
              volume={this.state.volume[qnIndx]}
              idleBackgroundColor={this.state.varPlayColour[qnIndx]}
              active={this.state.active}
            />
            <br />
            <br />
            <strong>Q{this.state.qnNum}a:</strong> How aversive (on a scale of{" "}
            <strong>1</strong> (pleasant) to <strong>100</strong> (unpleasant))
            is this sound?
            <br />
            <br />
            <RatingSlider.AverSlider
              key={averRatingDef}
              callBackValue={this.callbackAver.bind(this)}
              initialValue={averRatingDef}
            />
            <br />
            <br />
            <strong>Q{this.state.qnNum}b:</strong> How arousing (on a scale of{" "}
            <strong>1</strong> (sleepy) to <strong>100</strong> (awake)) is this
            sound?
            <br />
            <br />
            <RatingSlider.ArouSlider
              key={arouRatingDef}
              callBackValue={this.callbackArou.bind(this)}
              initialValue2={arouRatingDef}
            />
            <br />
            <br />
            <strong>Q{this.state.qnNum}c:</strong> How negative or postive (on a
            scale of <strong>1</strong> (miserable) to <strong>100</strong>
            &nbsp;(happy)) is this sound?
            <br />
            <br />
            <RatingSlider.ValSlider
              key={valRatingDef}
              callBackValue={this.callbackVal.bind(this)}
              initialValue3={valRatingDef}
            />
            <br />
            <br />
            <div className="col-md-12 text-center">
              [Note: You must <strong>drag</strong> all sliders at least once to
              click NEXT.]
              <br />
              <br />
              <Button
                id="right"
                className={styles.clc}
                disabled={this.state.btnDisNext}
                onClick={this.saveData.bind(this)}
              >
                NEXT
              </Button>
            </div>
          </span>
        </span>
      </div>
    );

    return <div>{question_text}</div>;
  }

  // Mount the component to call the BACKEND and GET the information
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  useEffect() {
    window.scrollTo(0, 0);
  }

  // Push to next page
  redirectToTarget() {
    this.props.history.push({
      pathname: `/EndPage`,
      state: { participant_info: this.state },
    });
  }

  render() {
    let text;
    if (this.state.quizScreen === false) {
      this.useEffect();
      text = (
        <div className={styles.main}>
          <p>
            <span className={styles.center}>
              <strong>AUDIO TEST: PART II</strong>
            </span>
            <br />
            Good job! For the next section, we present you with a variety of
            sound bites.
            <br />
            <br />
            All you have to do is to listen to them and rate the extent to which
            they were:
            <br /> <br />
            1) <strong>aversive</strong>: on scale of pleasant to unpleasant
            <br />
            2) <strong>arousing</strong>: on scale of sleepy to awake <br />
            3) <strong>postive</strong> or <strong>negative</strong>: on scale
            of miserable to happy
            <br />
            <br />
            Remember to keep your headphones on and do not adjust your sound
            settings.
            <br />
            <br />
            Some sounds will repeat. In total, there are {
              this.state.qnNumTotal
            }{" "}
            sound bites to rate.
            <br />
            <br />
            When you are ready, please click <strong>START</strong> to begin.
            <br />
            <br />
            <span className={styles.center}>
              <Button type="button" onClick={() => this.start_quest()}>
                START
              </Button>
            </span>
          </p>
        </div>
      );
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

export default withRouter(EndPage);
