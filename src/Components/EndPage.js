import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "react-bootstrap";
import styles from "./style/taskStyle.module.css";

class EndPage extends React.Component {
  constructor(props) {
    super(props);

    const userID = this.props.location.state.userID;
    // var currentDate = new Date();
    //  const userID = 1000;

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

  redirectToEnd() {
    alert("You will now be redirected to the validation page.");

    window.location = "https://app.prolific.co/submissions/complete?";
  }

  render() {
    return (
      <div className={styles.main}>
        <p>
          <span className={styles.center}>
            <strong>END</strong>
          </span>
          <br />
          Thanks for completing the task!
          <br />
          <br />
          Your data makes an important contribution to our understanding of
          mental health.
          <br />
          <br />
          In this task, we were interested in how you rate a variety of sounds.
          Previous work has utilised various sounds in experimental tasks to
          link differences in behaviour to psychiatric disorders, which we are
          aiming to understand better. Thanks for your help!
          <br />
          <br />
          If you feel that completing the questionnaires on any of the
          psychopathologies caused you any distress, please use the following
          contact details for help and support.
          <br />
          <br />
          <i>Web pages</i>
          <br />
          <strong>National Institute of Mental Health:</strong>&nbsp;
          <a href="https://www.nimh.nih.gov/health/find-help/index.shtml">
            https://www.nimh.nih.gov/health/find-help/index.shtml
          </a>
          <br />
          <strong>Anxiety and Depression Association of America:</strong>&nbsp;
          <a href="https://adaa.org/adaa-online-support-group">
            https://adaa.org/adaa-online-support-group
          </a>
          <br />
          <strong>Depression and Bipolar Support Alliance:</strong>&nbsp;
          <a href="http://www.dbsalliance.org/">http://www.dbsalliance.org/</a>
          <br />
          <strong>Mental Health America:</strong>&nbsp;
          <a href="http://www.mentalhealthamerica.net/">
            http://www.mentalhealthamerica.net/
          </a>
          <br />
          <strong>National Alliance on Mental Illness:</strong>&nbsp;
          <a href="http://www.nami.org/">http://www.nami.org/</a>
          <br /> <br />
          <i>Support lines</i>
          <br />
          <strong> National Suicide Prevention Lifeline:</strong> 1-800-273-8255
          <br />
          <br />
          If you are ready to return to Prolific, click the button below.
          <br />
          <br />
          <span className={styles.centerTwo}>
            <Button
              className={styles.clc}
              onClick={this.redirectToEnd.bind(this)}
            >
              Complete
            </Button>
          </span>
        </p>
      </div>
    );
  }
}

export default withRouter(EndPage);
