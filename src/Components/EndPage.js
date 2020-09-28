import React from "react";
import { withRouter } from "react-router-dom";
import styles from "./style/taskStyle.module.css";

class EndPage extends React.Component {
  constructor(props) {
    super(props);

    const userID = this.props.location.state.userID;
    var currentDate = new Date();

    // This will change for the questionnaires going AFTER the main task
    this.state = {
      userID: userID,
    };
  }

  // Mount the component to call the BACKEND and GET the information
  componentDidMount() {
    document.body.style.background = "fff";
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className={styles.main}>
        <p>
          <span className={styles.center}>
            <strong>END</strong>
          </span>
          <br />
          <br />
          Thanks for completing the task!
        </p>
      </div>
    );
  }
}

export default withRouter(EndPage);
