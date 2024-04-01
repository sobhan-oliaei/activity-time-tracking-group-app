import axios from 'axios';
import addresses from './addresses';
import groupClass from './groupClass';

/**
* A class containing the user sessions functions of app
*/
export default class sessionClass {
  /**
  * A function that starts a session activity for user
  */
  startSession(cookies, job, sessionStartTimerStatus, setSessionStartButtonDisplay, setSessionCancelButtonDisplay, setSessionFinishButtonDisplay, setSessionEditButtonDisplay, setSessionStartTimerStatus) {
    if (job != "انتخاب کار" && job != "" && job) {
      const addr = new addresses();
      axios
        .get(addr.serverAddress + ':3001/startSession?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd, job: job }).toString())
        .then(res => {
          let data = res.data;
          if (data['msg'] == "true") {
            setSessionStartButtonDisplay("none");
            setSessionCancelButtonDisplay("block");
            setSessionFinishButtonDisplay("block");
            setSessionEditButtonDisplay("none");
            setSessionStartTimerStatus(!sessionStartTimerStatus);
          }
        });
    }
    else {
      alert("برای ثبت فعالیت یک کار انتخاب کنید");
    }
  }

  /**
  * A function that checks if user has a active session or not
  */
  checkSession(cookies, setSessionStartButtonDisplay, setSessionCancelButtonDisplay, setSessionFinishButtonDisplay, setSessionEditButtonDisplay, setSessionStartTimerStatus, setSessionTime, setPickedJob) {
    const addr = new addresses();
    axios
      .get(addr.serverAddress + ':3001/checkSession?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd }).toString())
      .then(res => {
        let data = res.data;
        if (data['msg'] == "true") {
          let hours = Number(data['hours']);
          let minutes = Number(data['minutes']);
          let timeHourText = String(hours);
          if (hours < 10) {
            timeHourText = "0" + timeHourText;
          }
          let timeMinuteText = String(minutes);
          if (minutes < 10) {
            timeMinuteText = "0" + timeMinuteText;
          }
          setSessionTime(timeHourText + ":" + timeMinuteText);
          setPickedJob(data['job']);
          setSessionStartButtonDisplay("none");
          setSessionCancelButtonDisplay("block");
          setSessionFinishButtonDisplay("block");
          setSessionEditButtonDisplay("none");
          setSessionStartTimerStatus(true);
        }
      });
  }

  /**
  * A function that removes active user session
  */
  removeSession(cookies, sessionFinishTimerStatus, setSessionFinishTimerStatus, setSessionStartButtonDisplay, setSessionCancelButtonDisplay, setSessionFinishButtonDisplay, setSessionEditButtonDisplay, setSessionTime, setEditSessionDisplay) {
    const addr = new addresses();
    axios
      .get(addr.serverAddress + ':3001/removeSession?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd }).toString())
      .then(res => {
        let data = res.data;
        if (data['msg'] == "true") {
          setSessionStartButtonDisplay("block");
          setSessionCancelButtonDisplay("none");
          setSessionFinishButtonDisplay("none");
          setSessionEditButtonDisplay("block");
          setEditSessionDisplay("none");
          setSessionTime("00 : 00");
          setSessionFinishTimerStatus(!sessionFinishTimerStatus);
        }
      });
  }

  /**
  * A function that saves active user session
  */
  saveSession(cookies, sessionFinishTimerStatus, setSessionFinishTimerStatus, setSessionStartButtonDisplay, setSessionCancelButtonDisplay, setSessionFinishButtonDisplay, setSessionEditButtonDisplay, setSessionTime, setGroupScoreListCurtainDisplay, setGroupScoreList) {
    const addr = new addresses();
    axios
      .get(addr.serverAddress + ':3001/saveSession?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd }).toString())
      .then(res => {
        let data = res.data;
        if (data['msg'] == "true") {
          setSessionStartButtonDisplay("block");
          setSessionCancelButtonDisplay("none");
          setSessionFinishButtonDisplay("none");
          setSessionEditButtonDisplay("block");
          setSessionTime("00:00");
          const groupCl = new groupClass();
          groupCl.isInGroupHome(cookies, setGroupScoreListCurtainDisplay, setGroupScoreList);
          setSessionFinishTimerStatus(!sessionFinishTimerStatus);
        }
        else if (data['msg'] == "less than 5 minutes") {
          alert("نمیتوانید فعالیتی با زمان کمتر از 5 دقیقه ثبت کنید");
        }
      });
  }

  /**
  * A function that edits active user session
  */
  editSession(cookies, editSessionHour, editSessionMinute, sessionFinishTimerStatus, setSessionFinishTimerStatus, setSessionStartButtonDisplay, setSessionCancelButtonDisplay, setSessionFinishButtonDisplay, setSessionEditButtonDisplay, setSessionTime, setGroupScoreListCurtainDisplay, setGroupScoreList, setEditSessionDisplay) {
    if (editSessionHour > 0 || editSessionMinute > 0) {
      const addr = new addresses();
      axios
        .get(addr.serverAddress + ':3001/editSaveSession?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd, hour: editSessionHour, minute: editSessionMinute }).toString())
        .then(res => {
          let data = res.data;
          if (data['msg'] == "true") {
            setSessionStartButtonDisplay("block");
            setSessionCancelButtonDisplay("none");
            setSessionFinishButtonDisplay("none");
            setSessionEditButtonDisplay("block");
            setEditSessionDisplay("none");
            setSessionTime("00:00");
            const groupCl = new groupClass();
            groupCl.isInGroupHome(cookies, setGroupScoreListCurtainDisplay, setGroupScoreList);
            setSessionFinishTimerStatus(!sessionFinishTimerStatus);
          }
          else if (data['msg'] == "number is bigger than time") {
            alert("زمان وارد شده نمیتواند بیشتر از میزان فعالیت باشد");
          }
          else if (data['msg'] == "less than 5 minutes") {
            alert("نمیتوانید فعالیتی با زمان کمتر از 5 دقیقه ثبت کنید");
          }
        });
    }
  }
}