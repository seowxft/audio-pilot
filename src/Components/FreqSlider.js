import React, { useState } from "react";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import RangeSlider from "react-bootstrap-range-slider";
import styles from "./style/taskStyle.module.css";

// var initialMin = 35;
// var initialMax = 65;
//
// function getRandomArbitrary(min, max) {
//   return Math.round(Math.random() * (max - min) + min);
// }

var initialFreq = 800;
var maxFreq = 24000;

export const FreqSlider = ({ callBackValue, initialValue }) => {
  const [freqScale, setValue] = useState(initialValue);

  return (
    <div className={styles.shortSlider}>
      <RangeSlider
        value={freqScale}
        size="lg"
        onChange={(changeEvent) => {
          const newValue = changeEvent.target.value;
          setValue(newValue);
          callBackValue(newValue);
        }}
        tooltipLabel={(currentValue) => `${currentValue}`}
        tooltip="off"
        variant="primary"
        min={initialValue}
        max={maxFreq}
      />
    </div>
  );
};

export const FreqSlider2 = ({ callBackValue, initialValue2 }) => {
  const [freqScale2, setValue] = useState(initialValue2);

  return (
    <div className={styles.shortSlider}>
      <RangeSlider
        value={freqScale2}
        size="lg"
        onChange={(changeEvent) => {
          const newValue = changeEvent.target.value;
          setValue(newValue);
          callBackValue(newValue);
        }}
        tooltipLabel={(currentValue) => `${currentValue}`}
        tooltip="off"
        variant="info"
        min={initialValue2 - 500}
        max={maxFreq}
      />
    </div>
  );
};

export const FreqSlider3 = ({ callBackValue, initialValue3 }) => {
  const [freqScale3, setValue] = useState(initialValue3);

  return (
    <div className={styles.shortSlider}>
      <RangeSlider
        value={freqScale3}
        size="lg"
        onChange={(changeEvent) => {
          const newValue = changeEvent.target.value;
          setValue(newValue);
          callBackValue(newValue);
        }}
        tooltipLabel={(currentValue) => `${currentValue}`}
        tooltip="off"
        variant="warning"
        min={initialValue3 - 500}
        max={maxFreq}
      />
    </div>
  );
};
