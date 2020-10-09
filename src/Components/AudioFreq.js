import React from "react";
import { Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import styles from "./style/taskStyle.module.css";

import Tone from "react-tone";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import Play from "./Play";
import Pause from "./Pause";
import { DATABASE_URL } from "./config";

////////////////////////////////////////////////////////////////////////////////
//Functions
////////////////////////////////////////////////////////////////////////////////
//for volume and frequency?, it is in log scale
function logslider(position, min, max) {
  // position will be between 0 and 100
  var minp = 0;
  var maxp = 100;

  // The bounds of the slider
  var minv = Math.log(min);
  var maxv = Math.log(max);

  // calculate adjustment factor
  var scale = (maxv - minv) / (maxp - minp);

  return Math.exp(minv + scale * (position - minp));
}

//return slider position
function logposition(value, min, max) {
  // position will be between 0 and 100
  var minp = 0;
  var maxp = 100;

  // The bounds of the slider
  var minv = Math.log(min);
  var maxv = Math.log(max);

  // calculate adjustment factor
  var scale = (maxv - minv) / (maxp - minp);

  return (Math.log(value) - minv) / scale + minp;
}

////////////////////////////////////////////////////////////////////////////////
//React component
////////////////////////////////////////////////////////////////////////////////
class AudioFreq extends React.Component {
  constructor(props) {
    super(props);

    const userID = this.props.location.state.userID;
    const volume = this.props.location.state.volume;
    const volumeNotLog = this.props.location.state.volumeNotLog;
    // var currentDate = new Date();
    var currTime = Math.round(performance.now());

    console.log("Vol(Lg) from headphone: " + volume);
    console.log("Vol(nLg) from headphone: " + volumeNotLog);

    //React-tone.js is between 0 (silent) and 1 (full) for volume
    var toneVol = volume / 100;

    ////////////////////////////////////////////////////////////////////////////////
    //Set states
    ////////////////////////////////////////////////////////////////////////////////
    this.state = {
      userID: userID,
      volume: volume,
      volumeNotLog: volumeNotLog,
      toneVol: toneVol,
      qnTime: currTime,
      qnRT: 0,
      qnNumTotal: 3,
      qnNum: 0,
      quizScreen: false,
      btnDisTone: false,
      btnDisNext: true,
      isTonePlaying: false,
      sliderFreq: null,
      sliderFreqDefault: 1000,
      sliderFreqPos: null,
      sliderFreqDefaultPos: null,
      sliderFreqSlidMin: null,
      freqThres: [0, 0, 0],
      freqThresIndiv: null,
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
  ////////////////////////////////////////////////////////////////////////////////
  // End constructor and props
  ////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////////
  //Start the frequency quiz
  ////////////////////////////////////////////////////////////////////////////////
  start_quest() {
    var currTime = Math.round(performance.now());

    this.setState({
      quizScreen: true,
      qnNum: 0,
      qnTime: currTime,
      qnRT: 0,
    });
    setTimeout(
      function () {
        this.quizNext();
      }.bind(this),
      0
    );
  }

  ////////////////////////////////////////////////////////////////////////////////
  //Function to play frequency
  ////////////////////////////////////////////////////////////////////////////////
  playEmptyBuffer = () => {
    // start an empty buffer with an instance of AudioContext
    const buffer = this.audioContext.createBuffer(1, 1, 22050);
    const node = this.audioContext.createBufferSource();
    node.buffer = buffer;
    node.start(0);
    this.iosAudioContextUnlocked = true;
  };

  ////////////////////////////////////////////////////////////////////////////////
  //Toggle frequency playing
  ////////////////////////////////////////////////////////////////////////////////
  handleClick = () => {
    if (!this.iosAudioContextUnlocked) this.playEmptyBuffer();
    this.setState({ isTonePlaying: true });
  };

  ////////////////////////////////////////////////////////////////////////////////
  //Function to stop tone from playing
  ////////////////////////////////////////////////////////////////////////////////
  handleToneStop = () => {
    this.setState({ isTonePlaying: false });
  };

  ////////////////////////////////////////////////////////////////////////////////
  //(Includes first qn) Move on to next frequency adjustment slider
  ////////////////////////////////////////////////////////////////////////////////
  quizNext() {
    this.useEffect();
    var qnNum = this.state.qnNum + 1;
    var qnTime = Math.round(performance.now()); //for the next question
    let sliderFreqDefault;
    let sliderFreqSlidMin;

    if (qnNum > 1) {
      //If it is the second or third question, I need to change the sliderFreqDefault
      //Now it resets to what the prev set frequency was
      sliderFreqDefault = this.state.sliderFreq;
      var min = sliderFreqDefault / 2;
      sliderFreqSlidMin = sliderFreqDefault - min;
    } else {
      sliderFreqDefault = this.state.sliderFreqDefault;
      sliderFreqSlidMin = sliderFreqDefault - 300;
    }

    var sliderFreqPos = logposition(
      sliderFreqDefault,
      sliderFreqSlidMin,
      22000
    );

    var sliderFreq = logslider(sliderFreqPos, sliderFreqSlidMin, 22000);

    console.log("qnNum: " + qnNum);
    console.log("sliderFreqPos: " + sliderFreqPos);
    console.log("sliderFreq: " + sliderFreq);
    console.log("sliderFreqSlidMin: " + sliderFreqSlidMin);

    this.setState({
      qnNum: qnNum,
      qnTime: qnTime,
      btnDisTone: false,
      btnDisNext: true,
      freqThresIndiv: null,
      sliderFreqPos: sliderFreqPos,
      sliderFreqDefaultPos: sliderFreqPos,
      sliderFreq: sliderFreq,
      sliderFreqDefault: sliderFreqDefault,
      sliderFreqSlidMin: sliderFreqSlidMin,
    });
  }

  ////////////////////////////////////////////////////////////////////////////////
  //Record value on freqencyslider
  ////////////////////////////////////////////////////////////////////////////////
  onSliderChange = (freqPos) => {
    //I get the freqency slider num )this should be between 1 to 100
    //Also convert to actual freqency for the tone
    var sliderFreq = Math.round(
      logslider(freqPos, this.state.sliderFreqSlidMin, 22000)
    );

    // console.log("sliderFreqPos: " + freqPos);
    // console.log("sliderFreq: " + sliderFreq);
    // console.log("sliderFreqDefault: " + this.state.sliderFreqDefault);

    this.setState({
      sliderFreqPos: freqPos,
      sliderFreq: sliderFreq,
    });

    if (this.state.sliderFreq !== this.state.sliderFreqDefault) {
      this.setState({ btnDisNext: false });
    }
  };

  ////////////////////////////////////////////////////////////////////////////////
  //Frequency adjusting task
  ////////////////////////////////////////////////////////////////////////////////
  ratingTask(qnNum) {
    //console.log("Tone Vol: " + this.state.toneVol);

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
            volume={this.state.toneVol}
            length={this.state.toneLength}
            onStop={this.handleToneStop}
          />
          <br />
          Using the slider below, adjust it (left and right) until you can only{" "}
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
                defaultValue={this.state.sliderFreqDefaultPos}
                value={this.state.sliderFreqPos}
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
                min={0}
                max={100}
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

            <div className={styles.shortSlider}>
              <Slider
                defaultValue={this.state.sliderFreqDefaultPos}
                value={this.state.sliderFreqPos}
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
                min={0}
                max={100}
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
                defaultValue={this.state.sliderFreqDefaultPos}
                value={this.state.sliderFreqPos}
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
                min={0}
                max={100}
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

  ////////////////////////////////////////////////////////////////////////////////
  //Save the frequency chosen
  ////////////////////////////////////////////////////////////////////////////////
  saveQuizData() {
    var qnRT = Math.round(performance.now()) - this.state.qnTime;
    var freqThres = this.state.freqThres;
    freqThres[this.state.qnNum - 1] = this.state.sliderFreq;
    var freqThresIndiv = this.state.sliderFreq;
    var userID = this.state.userID;

    console.log("Qn Num: " + this.state.qnNum);
    console.log("Freq Thres: " + freqThres);

    this.setState({
      qnRT: qnRT,
      freqThresIndiv: freqThresIndiv,
      freqThres: freqThres,
    });

    let quizbehaviour = {
      userID: this.state.userID,
      qnTime: this.state.qnTime,
      qnRT: qnRT,
      qnNum: this.state.qnNum,
      volume: this.state.volume,
      volumeNotLog: this.state.volumeNotLog,
      freqThresIndiv: freqThresIndiv,
      sliderFreqDefault: this.state.sliderFreqDefault,
    };

    try {
      fetch(`${DATABASE_URL}/audio_freq/` + userID, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizbehaviour),
      });
    } catch (e) {
      console.log("Cant post?");
    }

    //lag a bit to make sure statestate is saved
    setTimeout(
      function () {
        this.quizNext();
      }.bind(this),
      10
    );
  }

  ////////////////////////////////////////////////////////////////////////////////
  //Function to ensure page always starts from the top
  ////////////////////////////////////////////////////////////////////////////////
  useEffect() {
    window.scrollTo(0, 0);
  }

  ////////////////////////////////////////////////////////////////////////////////
  //Mount component
  ////////////////////////////////////////////////////////////////////////////////
  componentDidMount() {
    window.scrollTo(0, 0);
    this.audioContext = new AudioContext();
  }

  ////////////////////////////////////////////////////////////////////////////////
  //Move to next section of the task
  ////////////////////////////////////////////////////////////////////////////////
  redirectToTarget() {
    this.props.history.push({
      pathname: `/AudioPilot`,
      state: {
        userID: this.state.userID,
        volume: this.state.volume,
        volumeNotLog: this.state.volumeNotLog,
        sliderFreq: this.state.sliderFreq,
      },
    });
  }

  ////////////////////////////////////////////////////////////////////////////////
  //Render time!
  ////////////////////////////////////////////////////////////////////////////////
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

export default withRouter(AudioFreq);
