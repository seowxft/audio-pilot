import React from "react";
import { Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import styles from "./style/taskStyle.module.css";

import Tone from "react-tone";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import Play from "./Play";
import Pause from "./Pause";

class EndPage extends React.Component {
  constructor(props) {
    super(props);

    const userID = this.props.location.state.userID;
    const volume = this.props.location.state.volume;
    var currentDate = new Date();
    var volMod = 0.1;

    var adjvolume = volMod * volume;

    console.log("volume" + volume);
    console.log("adjvolume" + adjvolume);
    // This will change for the questionnaires going AFTER the main task
    this.state = {
      userID: userID,
      volume: adjvolume,
      qnNumTotal: 3,
      qnNum: 0,
      volMod: volMod,
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
    this.redirectToTarget = this.redirectToTarget.bind(this);
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

    if (qnNum > this.state.qnNumTotal) {
      var adjvolume = this.state.volume / this.state.volMod;
      console.log("qnNum: " + qnNum);
      console.log("final vol: " + adjvolume);
      this.setState({ volume: adjvolume });
    }
  }

  // callbackFreq(callBackValue) {
  //   //on a scale between 1-100, between hearing range of 800 to 20000
  //   var sliderFreq = parseInt(callBackValue);
  //   this.setState({ sliderFreq: sliderFreq });
  //
  //   console.log(sliderFreq);
  //   if (this.state.sliderFreq !== this.state.sliderFreqDefault) {
  //     this.setState({ btnDisNext: false });
  //   }
  // }

  handleClick = () => {
    if (!this.iosAudioContextUnlocked) this.playEmptyBuffer();

    this.setState({ isTonePlaying: true });
  };

  onSliderChange = (value) => {
    console.log(value);
    this.setState({
      sliderFreq: value,
    });

    if (this.state.sliderFreq !== this.state.sliderFreqDefault) {
      this.setState({ btnDisNext: false });
    }
  };

  ratingTask(qnNum) {
    var volume = this.state.volume / 100;
    console.log("Playing at " + volume);

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
          <br />
          You can play the tone as many times as you like.
        </p>
      </div>
    );

    let question_text4 = (
      <div className="col-md-12 text-center">
        <span className={styles.smallfont}>
          [You must <strong>drag</strong> (not just click) the slider at least
          once to click NEXT.]
        </span>
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
            <div className={styles.shortSlider}>
              <Slider
                defaultValue={this.state.sliderFreqDefault}
                value={this.state.sliderFreq}
                trackStyle={{ backgroundColor: "#D9D9D9", height: 10 }}
                handleStyle={{
                  borderColor: "#00BFFF",
                  height: 25,
                  width: 25,
                  marginLeft: 0,
                  marginTop: -9,
                  backgroundColor: "#00BFFF",
                }}
                railStyle={{ backgroundColor: "#D9D9D9", height: 10 }}
                min={this.state.sliderFreqDefault}
                max={24000}
                onChange={this.onSliderChange.bind(this)}
              />
            </div>
            <br />
            {question_text4}
          </div>
        );
      case 2:
        return (
          <div>
            {question_text2}
            {question_text3}
            <br />
            <div className={styles.shortSlider}>
              <Slider
                defaultValue={this.state.sliderFreqDefault - 3000}
                value={this.state.sliderFreq}
                trackStyle={{ backgroundColor: "#D9D9D9", height: 10 }}
                reverse
                handleStyle={{
                  borderColor: "#9000FF",
                  height: 25,
                  width: 25,
                  marginLeft: -14,
                  marginTop: -9,
                  backgroundColor: "#9000FF",
                }}
                railStyle={{ backgroundColor: "#D9D9D9", height: 10 }}
                min={this.state.sliderFreqDefault - 3000}
                max={24000}
                onChange={this.onSliderChange.bind(this)}
              />
            </div>
            <br />
            {question_text4}
          </div>
        );
      case 3:
        return (
          <div>
            {question_text2}
            {question_text3}
            <div className={styles.shortSlider}>
              <Slider
                defaultValue={this.state.sliderFreqDefault - 3000}
                value={this.state.sliderFreq}
                trackStyle={{ backgroundColor: "#D9D9D9", height: 10 }}
                handleStyle={{
                  borderColor: "#FF8F00",
                  height: 25,
                  width: 25,
                  marginLeft: 0,
                  marginTop: -9,
                  backgroundColor: "#FF8F00",
                }}
                railStyle={{ backgroundColor: "#D9D9D9", height: 10 }}
                min={this.state.sliderFreqDefault - 3000}
                max={24000}
                onChange={this.onSliderChange.bind(this)}
              />
            </div>
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
    this.props.history.push({
      pathname: `/AudioPilot`,
      state: {
        userID: this.state.userID,
        volume: this.state.volume,
        sliderFreq: this.state.sliderFreq,
        volMod: this.state.volMod,
      },
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
