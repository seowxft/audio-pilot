import React from "react";
import { Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import styles from "./style/taskStyle.module.css";

import Tone from "react-tone";

import * as FreqSlider from "./FreqSlider.js";

import Play from "./Play";
import Pause from "./Pause";

class EndPage extends React.Component {
  constructor(props) {
    super(props);

    const userID = this.props.location.state.userID;
    const volume = this.props.location.state.volume;
    var currentDate = new Date();

    var adjvolume = 0.8 * volume;

    console.log(userID);
    console.log(volume);
    // This will change for the questionnaires going AFTER the main task
    this.state = {
      userID: userID,
      volume: adjvolume,
      qnNumTotal: 3,
      qnNum: 0,
      quizScreen: false,
      btnDisTone: false,
      btnDisNext: true,
      isTonePlaying: false,
      sliderFreq: null,
      sliderFreqDefault: 800,
      freqThres: [0, 0, 0],

      toneLength: 2,
    };

    /* prevents page from going down when space bar is hit .*/
    window.addEventListener("keydown", function (e) {
      if (e.keyCode === 32 && e.target === document.body) {
        e.preventDefault();
      }
    });

    this.audioContext = undefined;
    this.iosAudioContextUnlocked = false;
    this.handleClick = this.handleClick.bind(this);
  }
  /// END PROPS

  start_quest() {
    var currTime = Math.round(performance.now());

    this.setState({
      quizScreen: true,
      qnNum: 0,
      qnTime: currTime,
    });
    setTimeout(
      function () {
        this.quizNext();
      }.bind(this),
      0
    );
  }

  useEffect() {
    window.scrollTo(0, 0);
  }

  quizNext() {
    this.useEffect();
    var qnNum = this.state.qnNum + 1;
    var quizTime = Math.round(performance.now()); //for the next question
    var percentage = (qnNum / this.state.qnNumTotal) * 100;
    this.setState({
      qnNum: qnNum,
      quizTime: quizTime,
      btnDisTone: false,
      btnDisNext: true,
      sliderFreq: this.state.sliderFreqDefault,
    });
  }

  callbackFreq(callBackValue) {
    //on a scale between 1-100, between hearing range of 800 to 20000
    var sliderFreq = parseInt(callBackValue);
    this.setState({ sliderFreq: sliderFreq });

    if (this.state.sliderFreq !== this.state.sliderFreqDefault) {
      this.setState({ btnDisNext: false });
    }
  }

  handleClick = () => {
    if (!this.iosAudioContextUnlocked) this.playEmptyBuffer();

    this.setState({ isTonePlaying: true });
  };

  ratingTask(qnNum) {
    var volume = this.state.volume / 100;

    let question_text1 = (
      <div className={styles.quiz}>
        <span className={styles.center}>
          <strong>
            Question {this.state.qnNum} of {this.state.qnNumTotal}
          </strong>
        </span>
      </div>
    );

    let question_text2 = (
      <div className={styles.quiz}>
        <span>
          <span className={styles.center}>
            <strong>
              Question {this.state.qnNum} of {this.state.qnNumTotal}
            </strong>
          </span>
          <br />
          Please adjust the tone again.
        </span>
      </div>
    );

    let question_text3 = (
      <div className={styles.quiz}>
        <p>
          Click the play button below to hear the tone.
          <br /> <br />
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
            frequency={this.state.sliderFreq}
            volume={volume}
            length={this.state.toneLength}
            onStop={this.handleToneStop}
          />
          <br />
          Using the slider below, adjust it until you can only{" "}
          <strong>just</strong> hear the tone comfortably.
        </p>
      </div>
    );

    let question_text4 = (
      <div className="col-md-12 text-center">
        [You must <strong>drag</strong> the slider at least once to click NEXT.]
        <br />
        <br />
        <Button
          id="right"
          className={styles.clc}
          disabled={this.state.btnDisNext}
          onClick={this.saveQuizData.bind(this)}
        >
          NEXT
        </Button>
      </div>
    );

    switch (qnNum) {
      case 1:
        return (
          <div>
            {question_text1}
            {question_text3}
            <FreqSlider.FreqSlider
              callBackValue={this.callbackFreq.bind(this)}
              initialValue={this.state.sliderFreqDefault}
            />
            <br />

            {question_text4}
          </div>
        );
      case 2:
        return (
          <div>
            {question_text2}
            {question_text3}
            <FreqSlider.FreqSlider2
              callBackValue={this.callbackFreq.bind(this)}
              initialValue={this.state.sliderFreqDefault}
            />
            <br />
            <br />
            {question_text4}
          </div>
        );
      case 3:
        return (
          <div>
            {question_text2}
            {question_text3}
            <FreqSlider.FreqSlider3
              callBackValue={this.callbackFreq.bind(this)}
              initialValue={this.state.sliderFreqDefault}
            />
            <br />
            <br />
            {question_text4}
          </div>
        );
      default:
    }
  }

  saveQuizData() {
    // var fileID = this.state.fileID;
    var qnTime = Math.round(performance.now()) - this.state.quizTime;
    var freqThres = this.state.freqThres;
    var qnNum = this.state.qnNum;
    console.log("freqThres " + freqThres);
    freqThres[this.state.qnNum - 1] = this.state.sliderFreq;

    var sliderFreqDefault = this.state.sliderFreq - 1000;

    console.log("qnNum " + qnNum);
    console.log("freqThres " + freqThres);

    this.setState({
      qnNum: qnNum,
      quizTime: qnTime,
      btnDisTone: false,
      btnDisNext: true,
      sliderFreqDefault: sliderFreqDefault,
    });

    let quizbehaviour = {
      userID: this.state.userID,
      qnTime: qnTime,
      qnNum: qnNum,
      freqThres: freqThres,
      sliderFreqDefault: sliderFreqDefault,
      sliderFreq: sliderFreqDefault,
    };

    // try {
    //   fetch(`${DATABASE_URL}/task_quiz/` + fileID, {
    //     method: "POST",
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(quizbehaviour),
    //   });
    // } catch (e) {
    //   console.log("Cant post?");
    // }

    //lag a bit to make sure statestate is saved
    setTimeout(
      function () {
        this.quizNext();
      }.bind(this),
      10
    );
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

  // Mount the component to call the BACKEND and GET the information
  componentDidMount() {
    window.scrollTo(0, 0);
    this.audioContext = new AudioContext();
  }

  // Push to next page
  redirectToTarget() {
    var adjvolume = this.state.volume / 0.8;
    this.setState({ volume: adjvolume });

    this.props.history.push({
      pathname: `/AudioPilot`,
      state: { userID: this.state.userID, volume: this.state.volume },
    });
  }

  render() {
    let text;
    if (this.state.quizScreen === false) {
      text = (
        <div className={styles.main}>
          <p>
            <span className={styles.center}>
              <strong>AUDIO TEST: PART I</strong>
            </span>
            <br />
            Great! You successfully passed the quiz!
            <br />
            <br />
            In this first section, we will present you with a tone.
            <br />
            <br />
            All you have to do is to adjust its freqency until you can{" "}
            <strong>just</strong> hear it.
            <br />
            <br />
            We will do this three times.
            <br />
            <br />
            Remember to keep your headphones on and do not adjust the sound
            settings unless stated.
            <br />
            <br />
            Click <strong>START</strong> to begin.
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
