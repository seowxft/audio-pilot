import React, { useState } from "react";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import RangeSlider from "react-bootstrap-range-slider";
import styles from "./style/taskStyle.module.css";

export const SliderVol = ({ callBackValue }) => {
  const [audioVol, setValue] = useState(80);

  return (
    <div className={styles.shortSlider}>
      <RangeSlider
        value={audioVol}
        size="lg"
        onChange={(changeEvent) => {
          const newValue = changeEvent.target.value;
          setValue(newValue);
          callBackValue(newValue);
        }}
        tooltipLabel={(currentValue) => `${currentValue}`}
        tooltip="off"
        variant="info"
      />
    </div>
  );
};
