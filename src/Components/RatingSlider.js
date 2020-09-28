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

// var initialStateAver = getRandomArbitrary(initialMin, initialMax);
// var initialStateArou = getRandomArbitrary(initialMin, initialMax);
// var initialStateVal = getRandomArbitrary(initialMin, initialMax);

export const AverSlider = ({ callBackValue, initialValue }) => {
  const [averScale, setValue] = useState(initialValue);

  return (
    <div className={styles.shortSlider}>
      <RangeSlider
        value={averScale}
        size="lg"
        onChange={(changeEvent) => {
          const newValue = changeEvent.target.value;
          setValue(newValue);
          callBackValue(newValue);
        }}
        tooltipLabel={(currentValue) => `${currentValue}`}
        tooltip="on"
        variant="primary"
      />
    </div>
  );
};

export const ArouSlider = ({ callBackValue, initialValue2 }) => {
  const [arouScale, setValue] = useState(initialValue2);

  return (
    <div className={styles.shortSlider}>
      <RangeSlider
        value={arouScale}
        size="lg"
        onChange={(changeEvent) => {
          const newValue = changeEvent.target.value;
          setValue(newValue);
          callBackValue(newValue);
        }}
        tooltipLabel={(currentValue) => `${currentValue}`}
        tooltip="on"
        variant="warning"
      />
    </div>
  );
};

export const ValSlider = ({ callBackValue, initialValue3 }) => {
  const [valScale, setValue] = useState(initialValue3);

  return (
    <div className={styles.shortSlider}>
      <RangeSlider
        value={valScale}
        size="lg"
        onChange={(changeEvent) => {
          const newValue = changeEvent.target.value;
          setValue(newValue);
          callBackValue(newValue);
        }}
        tooltipLabel={(currentValue) => `${currentValue}`}
        tooltip="on"
        variant="info"
      />
    </div>
  );
};
