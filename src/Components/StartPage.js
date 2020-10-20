import React from "react";
import { withRouter } from "react-router-dom";
import * as Survey from "survey-react";
import "../../node_modules/survey-react/survey.css";
import "./style/startPage.css";

class StartPage extends React.Component {
  constructor(props) {
    super(props);

    // Get data and time
    var currentDate = new Date(); // maybe change to local
    var date = currentDate.getDate();
    var month = currentDate.getMonth(); //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();
    var dateString = date + "-" + (month + 1) + "-" + year;
    var timeString = currentDate.toTimeString();

    // Get prolific_id

    let url = this.props.location.search;
    let params = queryString.parse(url);
    const prolific_id =
      params["PROLIFIC_PID"] === undefined
        ? "undefined"
        : params["PROLIFIC_PID"];

    // Gen a random 6 digit number for now
    //var userID = Math.floor(100000 + Math.random() * 900000);
    //var userID = 100000; //for testing

    // Set state
    this.state = {
      userID: prolific_id,
      date: dateString,
      startTime: timeString,
      consentComplete: 0,
    };

    this.redirectToTarget = this.redirectToTarget.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  redirectToTarget() {
    this.setState({
      consentComplete: 1,
    });

    this.props.history.push({
      pathname: `/HeadphoneCheck`,
      state: {
        userID: this.state.userID,
        date: this.state.date,
        startTime: this.state.startTime,
      },
    });
  }

  render() {
    var json = {
      title: null,
      pages: [
        {
          questions: [
            { type: "html", name: "info", html: "" },

            {
              type: "html",
              name: "info",
              html: "<h6>Who is conducting this research study?</h6>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p>This research is being conducted by the Wellcome Centre for Human Neuroimaging and the Max Planck UCL Centre for Computational Psychiatry and Ageing Research. The lead researchers for this project are Dr. Tricia Seow (t.seow@ucl.ac.uk) and Dr. Tobias Hauser (t.hauser@ucl.ac.uk). This study has been approved by the UCL Research Ethics Committee (project ID number 15301&#92;001) and funded by the Wellcome Trust.</p>",
            },

            {
              type: "html",
              name: "info",
              html: "<h6>What is the purpose of this study?</h6>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p> We are interested in how the adult brain controls learning and decision-making. This research aims to provide insights into how the healthy brain works to help us understand the causes of a number of different medical conditions.</p>",
            },

            {
              type: "html",
              name: "info",
              html: "<h6>Who can participate in the study?</h6>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p> Adults (aged 18 years to 40 years old). <br/>No auditory issues, including: <br/> History of hearing/auditory problems (e.g. hearing loss). <br/>Tinnitus (present or past). <br/>Hearing sensitivity. <br/>Hearing loss <br/>Use of hearing aid.  <br/><br/>If you take part in this study, you confirm that you meet the eligibity criteria.</p>",
            },

            {
              type: "html",
              name: "info",
              html: "<h6>What will happen to me if I take part?</h6>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p> You will play one or more online computer tasks, which will last around approximately 30 mins. <br/><br/>You will receive brief, unpleasant noises during some parts of the computer task(s). Before the start of the computer task, the volume of the noises will be adjusted to a level that is loud but that you are able to tolerate comfortably. This is in order to find a level that is appropriate for the experiment. We will not play any unpleasant noises that are more intense than you are comfortable with. <br/><br/>You will also be asked some questions about yourself, your feelings, background, attitudes and behaviour in your everyday life. <br/><br/>You will receive 4.15 GBP for helping us. <br/><br/>Remember, you are free to withdraw at any time without giving a reason.</p>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<h6>What are the possible disadvantages and risks of taking part?</h6>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p> The task you complete does not pose any known risks. You will be asked to answer some questions about mood and feelings, and we will provide information about ways to seek help should you feel affected by the issues raised by these questions.</p>",
            },

            {
              type: "html",
              name: "info",
              html: "<h6>What are the possible benefits of taking part?</h6>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p> While there are no immediate benefits to taking part, your participation in this research will help us understand how people make decisions and this could have benefits for our understanding of mental health problems. </p>",
            },

            { type: "html", name: "info", html: "<h6>Complaints</h6>" },

            {
              type: "html",
              name: "info",
              html:
                "<p> If you wish to complain or have any concerns about any aspect of the way you have been approached or treated by members of staff, then the research UCL complaints mechanisms are available to you. In the first instance, please talk to the researcher or the chief investigator (Dr Tobias Hauser, t.hauser@ucl.ac.uk) about your complaint. If you feel that the complaint has not been resolved satisfactorily, please contact the chair of the UCL Research Ethics Committee (ethics@ucl.ac.uk). <br/><br/>If you are concerned about how your personal data are being processed please contact the data controller who is UCL: data-protection@ucl.ac.uk. If you remain unsatisfied, you may wish to contact the Information Commissioner’s Office (ICO). Contact details, and details of data subject rights, are available on the ICO website at: https://ico.org.uk/for-organisations/data-protection-reform/overview-of-the-gdpr/individuals-rights. </p>",
            },

            {
              type: "html",
              name: "info",
              html: "<h6>What about my data?</h6>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p>To help future research and make the best use of the research data you have given us (such as answers to questionnaires) we may keep your research data indefinitely and share these. The data we collect will be shared and held as follows:<ul><li> In publications, your data will be anonymised, so you cannot be identified. </li><li> In public databases, your data will be anonymised. </li><li> We do not collect any personal data that could be used to identify you. </li></ul> The legal basis used to process your personal data will be the provision of public task (this means that the research you are taking part in is deemed to be in the public interest). The legal basis used to process special category data (i.e. ethnicity) will be for scientific research purposes. We will follow the UCL and legal guidelines to safeguard your data. If you change your mind and withdraw your consent to participate in this study you can contact us via Prolific. However, we collect all data in an anonymised form, which is why this data cannot be destroyed, withdrawn or recalled. <br/><br/>If there are any queries or concerns please do not hesitate to contact Dr. Tricia Seow, t.seow@ucl.ac.uk.</p>",
            },
          ],
        },

        {
          questions: [
            {
              type: "checkbox",
              name: "checkbox1",
              title:
                "I have read the information above, and understand what the study involves.",
              isRequired: true,
              choices: ["Yes"],
            },

            {
              type: "checkbox",
              name: "checkbox2",
              title:
                "I consent to the processing of my personal information (e.g. User Id) for the purposes of this research study. I understand that such information will remain confidential and will be handled in accordance with all applicable data protection legislation and ethical standards in research. These data will only be accessible to the study team and individuals from the University and Funder who are responsible for monitoring and audits.",
              isRequired: true,
              choices: ["Yes"],
            },

            {
              type: "checkbox",
              name: "checkbox3",
              title:
                "I understand that my anonymised personal data can be shared with others for future research, shared in public databases and in scientific reports.",
              isRequired: true,
              choices: ["Yes"],
            },

            {
              type: "checkbox",
              name: "checkbox4",
              title:
                "I understand that I am free to withdraw from this study at any time without giving a reason and this will not affect my future medical care or legal rights.",
              isRequired: true,
              choices: ["Yes"],
            },

            {
              type: "checkbox",
              name: "checkbox5",
              title:
                "I understand the potential benefits and risks of participating, the support available to me should I become distressed during the research, and who to contact if I wish to lodge a complaint.",
              isRequired: true,
              choices: ["Yes"],
            },

            {
              type: "checkbox",
              name: "checkbox6",
              title:
                "I understand the inclusion and exclusion criteria in the Information Sheet and as explained to me by the researcher.  I confirm that I do not fall under the exclusion criteria.",
              isRequired: true,
              choices: ["Yes"],
            },

            {
              type: "checkbox",
              name: "checkbox7",
              title:
                "I agree that the research project named above has been explained to me to my satisfaction and I agree to take part in this study.",
              isRequired: true,
              choices: ["Yes"],
            },
          ],
        },
      ],
    };

    if (this.state.consentComplete === 0) {
      return (
        <div className="place-middle">
          <br /> <br /> <br /> <br />
          <p>
            <span className="bold">INFORMATION FOR THE PARTICIPANT</span>
          </p>
          Please read this information page carefully. If you are happy to
          proceed, please check the boxes on the second page of this form to
          consent to this study proceeding. Please note that you cannot proceed
          to the study unless you give your full consent.
          <br />
          <br />
          <Survey.Survey
            json={json}
            showCompletedPage={false}
            onComplete={this.redirectToTarget}
          />
        </div>
      );
    } else {
      return null;
    }
  }
}

export default withRouter(StartPage);
