"use client"
import Image from 'next/image';
import Head from 'next/head';
import styles from './home.module.css';
import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import '../app/globals.css';
import jobsClass from '@/funs/jobsClass';
import basicClass from '@/funs/basicClass';
import sessionClass from '@/funs/sessionClass';
import groupClass from '@/funs/groupClass';

/**
* The component for displaying the Home page
*/
export default function HomePage() {
  const jobsCl = new jobsClass();
  const sessionCl = new sessionClass();
  const basicCl = new basicClass();
  const groupCl = new groupClass();
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [todayJobs, setTodayJobs] = useState([]);
  const timeOutRef = useRef(todayJobs);
  timeOutRef.current = todayJobs;
  const [jobs, setJobs] = useState([]);
  const [pickJobDisplay, setPickJobDisplay] = useState("none");
  const [pickedJob, setPickedJob] = useState("انتخاب کار");
  const [sessionTime, setSessionTime] = useState("00:00");
  const refSessionTime = useRef(sessionTime);
  refSessionTime.current = sessionTime;
  const refTimeInterVal = useRef();
  const [sessionStartButtonDisplay, setSessionStartButtonDisplay] = useState("block");
  const [sessionCancelButtonDisplay, setSessionCancelButtonDisplay] = useState("none");
  const [sessionFinishButtonDisplay, setSessionFinishButtonDisplay] = useState("none");
  const [sessionEditButtonDisplay, setSessionEditButtonDisplay] = useState("block");
  const [sessionStartTimerStatus, setSessionStartTimerStatus] = useState(false);
  const [sessionFinishTimerStatus, setSessionFinishTimerStatus] = useState(false);
  const [editSessionDisplay, setEditSessionDisplay] = useState("none");
  const [editSessionHour, setEditSessionHour] = useState(0);
  const [editSessionMinute, setEditSessionMinute] = useState(0);
  const [groupScoreListButton, setGroupScoreListButton] = useState({
    dayColor: 'antiquewhite',
    weekColor: 'rgb(255, 190, 104)',
    monthColor: 'antiquewhite'
  });
  const [groupScoreList, setGroupScoreList] = useState({ day: [], month: [], week: [], onlines: [] });
  const [groupScoreListCurtainDisplay, setGroupScoreListCurtainDisplay] = useState("none");
  useEffect(() => {
    if (window.innerWidth > 785) {
      router.push("/largeWindow")
    }
    else {
      basicCl.isLogged(cookies, router);
    }
    sessionCl.checkSession(cookies, setSessionStartButtonDisplay, setSessionCancelButtonDisplay, setSessionFinishButtonDisplay, setSessionEditButtonDisplay, setSessionStartTimerStatus, setSessionTime, setPickedJob);
    jobsCl.setTodayTasksStateHome(cookies, setTodayJobs);
    groupCl.isInGroupHome(cookies, setGroupScoreListCurtainDisplay, setGroupScoreList);
    return () => {
      if (typeof refTimeInterVal.current != 'undefined') {
        const intervalId = refTimeInterVal.current;
        clearInterval(intervalId);
      }
    }
  }, []);

  useEffect(() => {
    if (sessionFinishTimerStatus) {
      const intervalId = refTimeInterVal.current;
      clearInterval(intervalId);
      setSessionFinishTimerStatus(false);
    }
  }, [sessionFinishTimerStatus]);

  useEffect(() => {
    if (sessionStartTimerStatus) {
      const intervalId = setInterval(() => {
        let timeSplit = refSessionTime.current.split(":");
        let timeHour = Number(timeSplit[0]);
        let timeMinute = Number(timeSplit[1]) + 1;
        if (timeMinute >= 60) {
          timeHour = timeHour + 1;
          timeMinute = 0;
        }
        let timeHourText = String(timeHour);
        if (timeHour < 10) {
          timeHourText = "0" + timeHourText;
        }
        let timeMinuteText = String(timeMinute);
        if (timeMinute < 10) {
          timeMinuteText = "0" + timeMinuteText;
        }
        setSessionTime(timeHourText + ":" + timeMinuteText);
      }, 60000);
      refTimeInterVal.current = intervalId;
      setSessionStartTimerStatus(false);
    }

  }, [sessionStartTimerStatus]);

  /**
  * A function to run "updateTodayTasksStateHome" from "jobsClass" when a task hovered
  */
  const showTaskButton = (index) => {
    jobsCl.updateTodayTasksStateHome(index, todayJobs, setTodayJobs, timeOutRef);
  }

  /**
  * A function to run "removeTodayTaskHome" from "jobsClass" when remove task button 
  */
  const taskButtonFun = (index) => {
    jobsCl.removeTodayTaskHome(todayJobs[index][0], todayJobs[index][1], jobsCl.setTodayTasksStateHome(cookies, setTodayJobs), cookies, setTodayJobs);
  }

  /**
  * A function to run "setJobsStateHome" from "jobsClass" when pick a job button clicked
  */
  const pickAJob = () => {
    jobsCl.setJobsStateHome(cookies, setJobs, setPickJobDisplay);
  }

  /**
  * A function to run "setJobsStateHome" from "jobsClass" when pick a job button clicked
  */
  const startSession = () => {
    sessionCl.startSession(cookies, pickedJob, sessionStartTimerStatus, setSessionStartButtonDisplay, setSessionCancelButtonDisplay, setSessionFinishButtonDisplay, setSessionEditButtonDisplay, setSessionStartTimerStatus);
  }

  /**
  * A function to run "removeSession" from "sessionClass" when remove session button clicked
  */
  const removeSession = () => {
    sessionCl.removeSession(cookies, sessionFinishTimerStatus, setSessionFinishTimerStatus, setSessionStartButtonDisplay, setSessionCancelButtonDisplay, setSessionFinishButtonDisplay, setSessionEditButtonDisplay, setSessionTime, setEditSessionDisplay);
  }

  /**
  * A function to run "editSession" from "sessionClass" when edit session button clicked
  */
  const editSession = () => {
    sessionCl.editSession(cookies, editSessionHour, editSessionMinute, sessionFinishTimerStatus, setSessionFinishTimerStatus, setSessionStartButtonDisplay, setSessionCancelButtonDisplay, setSessionFinishButtonDisplay, setSessionEditButtonDisplay, setSessionTime, setGroupScoreListCurtainDisplay, setGroupScoreList, setEditSessionDisplay);
  }

  /**
  * A function to run "saveSession" from "sessionClass" when save session button clicked
  */
  const saveSession = () => {
    sessionCl.saveSession(cookies, sessionFinishTimerStatus, setSessionFinishTimerStatus, setSessionStartButtonDisplay, setSessionCancelButtonDisplay, setSessionFinishButtonDisplay, setSessionEditButtonDisplay, setSessionTime, setGroupScoreListCurtainDisplay, setGroupScoreList);
  }

  /**
  * A function to return the <p> needed to display the group's history
  */
  const groupScoreListP = (item, index) => {
    let isOnline = false;
    for (let i = 0; i < groupScoreList.onlines.length; i++) {
      if (groupScoreList.onlines[i] == item[0]) {
        isOnline = true;
      }
    }
    if (isOnline) {
      if (Number(item[2]) > 0 && Number(item[1]) <= 0) {
        return <p className={styles.groupScoreListP}><span className={styles.groupScoreListIndexSpan1}>{(index + 1)}</span><span className={styles.groupScoreListIndexSpan2} style={{ color: 'rgb(255, 255, 255)' }}>{item[0]}</span><span className={styles.groupScoreListIndexSpan3} style={{ width: "40%" }}>{item[2] + " ساعت"}</span></p>;
      }
      else if (Number(item[2]) > 0 && Number(item[1]) > 0) {
        return <p className={styles.groupScoreListP}><span className={styles.groupScoreListIndexSpan1}>{(index + 1)}</span><span className={styles.groupScoreListIndexSpan2} style={{ color: 'rgb(255, 255, 255)' }}>{item[0]}</span><span className={styles.groupScoreListIndexSpan3}>{item[2] + " ساعت"}</span><span className={styles.groupScoreListIndexSpan4}>{item[1] + " دقیقه"}</span></p>;
      }
      else if (Number(item[2]) <= 0 && Number(item[1]) > 0) {
        return <p className={styles.groupScoreListP}><span className={styles.groupScoreListIndexSpan1}>{(index + 1)}</span><span className={styles.groupScoreListIndexSpan2} style={{ color: 'rgb(255, 255, 255)' }}>{item[0]}</span><span className={styles.groupScoreListIndexSpan4} style={{ width: "40%" }}>{item[1] + " دقیقه"}</span></p>;
      }
    }
    else {
      if (Number(item[2]) > 0 && Number(item[1]) <= 0) {
        return <p className={styles.groupScoreListP}><span className={styles.groupScoreListIndexSpan1}>{(index + 1)}</span><span className={styles.groupScoreListIndexSpan2}>{item[0]}</span><span className={styles.groupScoreListIndexSpan3} style={{ width: "40%" }}>{item[2] + " ساعت"}</span></p>;
      }
      else if (Number(item[2]) > 0 && Number(item[1]) > 0) {
        return <p className={styles.groupScoreListP}><span className={styles.groupScoreListIndexSpan1}>{(index + 1)}</span><span className={styles.groupScoreListIndexSpan2}>{item[0]}</span><span className={styles.groupScoreListIndexSpan3}>{item[2] + " ساعت"}</span><span className={styles.groupScoreListIndexSpan4}>{item[1] + " دقیقه"}</span></p>;
      }
      else if (Number(item[2]) <= 0 && Number(item[1]) > 0) {
        return <p className={styles.groupScoreListP}><span className={styles.groupScoreListIndexSpan1}>{(index + 1)}</span><span className={styles.groupScoreListIndexSpan2}>{item[0]}</span><span className={styles.groupScoreListIndexSpan4} style={{ width: "40%" }}>{item[1] + " دقیقه"}</span></p>;
      }
    }
  }

  /**
  * A function to return the "groupScoreListP" needed to display the group's history
  */
  const groupScoreListSubDiv = () => {
    if (groupScoreListButton.dayColor == 'rgb(255, 190, 104)') {
      return groupScoreList.day.map((item, index) => { return groupScoreListP(item, index) });
    }
    else if (groupScoreListButton.weekColor == 'rgb(255, 190, 104)') {
      return groupScoreList.week.map((item, index) => { return groupScoreListP(item, index) });
    }
    else if (groupScoreListButton.monthColor == 'rgb(255, 190, 104)') {
      return groupScoreList.month.map((item, index) => { return groupScoreListP(item, index) });
    }
  }
  return (
    <main>
      <Head>
        <title>mofidshim home</title>
      </Head>
      <div className={styles.jobsDiv}>
        <h2 className={styles.jobsH2}>یادآور های امروز</h2>
        {todayJobs.map((item, index) => <p key={index} onClick={() => { showTaskButton(index) }} className={styles.jobsP}>{item[0]} <span onClick={() => { taskButtonFun(index) }} className={styles.jobsPTooltip} style={{ display: item[2] }}>تایید انجام کار</span></p>)}
      </div>
      <div className={styles.sessionModifDiv}>
        <h4 className={styles.sessionModifH3} onClick={() => { pickAJob() }}>{pickedJob}</h4>
        <span className={styles.sessionModifJobsTooltip} style={{ display: pickJobDisplay }}><Image className={styles.sessionModifJobsTooltipCloseImage} onClick={() => { setPickJobDisplay("none") }} width={60} height={60} src="/close-icon.png" alt="close icon" /><h3>لیست کار ها</h3>
          {jobs.map((item, index) => <p key={index} onClick={() => { if (item != "هیچ کاری ثبت نکردی") { setPickedJob(item); setPickJobDisplay("none") } }} className={styles.sessionModifJobsTooltipCloseP}>{item}</p>)}
        </span>
        <h4 className={styles.sessionModifH3} style={{ borderRightStyle: "dashed", width: "calc(50% - 3.9px)" }}>زمان ثبت شده : {sessionTime}</h4>
        <button className={styles.sessionModifButton} onClick={() => { startSession() }} style={{ display: sessionStartButtonDisplay }}>شروع انجام فعالیت</button>
        <button className={styles.sessionModifButton} onClick={() => { alert("به زودی") }} style={{ display: "none" }}>مدیریت فعالیت ها</button>
        <button className={styles.sessionModifButton} onClick={() => { setEditSessionDisplay("block"); let a = sessionTime.split(":"); setEditSessionHour(Number(a[0])); setEditSessionMinute(Number(a[1])); }} style={{ display: sessionCancelButtonDisplay }}>ثبت با ویرایش</button>
        <button className={styles.sessionModifButton} onClick={() => { saveSession() }} style={{ display: sessionFinishButtonDisplay }}>پایان ثبت فعالیت</button>
      </div>
      <div className={styles.groupScoreListDiv}>
        <h3>لیست فعالیت گروه</h3>
        <button className={styles.groupScoreListButton} onClick={() => { setGroupScoreListButton({ dayColor: "rgb(255, 190, 104)", weekColor: "antiquewhite", monthColor: "antiquewhite" }); }} style={{ backgroundColor: groupScoreListButton.dayColor }}>روز</button>
        <button className={styles.groupScoreListButton} onClick={() => { setGroupScoreListButton({ dayColor: "antiquewhite", weekColor: "rgb(255, 190, 104)", monthColor: "antiquewhite" }); }} style={{ backgroundColor: groupScoreListButton.weekColor }}>هفته</button>
        <button className={styles.groupScoreListButton} onClick={() => { setGroupScoreListButton({ dayColor: "antiquewhite", weekColor: "antiquewhite", monthColor: "rgb(255, 190, 104)" }); }} style={{ backgroundColor: groupScoreListButton.monthColor }}>ماه</button>
        <div className={styles.groupScoreListSubDiv}>
          {groupScoreListSubDiv()}
        </div>
        <div className={styles.groupScoreListCurtainDiv} style={{ display: groupScoreListCurtainDisplay }}><p className={styles.groupScoreListCurtainP}>ابتدا وارد گروه شوید</p></div>
      </div>
      <div className={styles.menuDiv}>
        <div className={styles.menuSubDiv}><Image width={60} height={60} src="/home-icon.png" alt="home icon"></Image><span className={styles.menuSpan}>خانه</span></div>
        <div className={styles.menuSubDiv}><Image width={60} height={60} src="/works-icon.png" alt="works icon" onClick={() => { router.push('/activity') }}></Image><span className={styles.menuSpan}>فعالیت</span></div>
        <div className={styles.menuSubDiv}><Image width={60} height={60} src="/group-icon.png" alt="group icon" onClick={() => { router.push('/group') }}></Image><span className={styles.menuSpan}>گروه</span></div>
        <div className={styles.menuSubDiv}><Image width={60} height={60} src="/sittings-icon.png" alt="sittings icon" onClick={() => { router.push('/sittings') }}></Image><span className={styles.menuSpan}>تنظیمات</span></div>
      </div>
      <div className={styles.editSessionDiv} style={{ display: editSessionDisplay }}>
        <Image className={styles.editSessionCloseImage} onClick={() => { setEditSessionDisplay("none") }} width={50} height={50} src="/close-icon.png" alt="close icon" />
        <p style={{ fontWeight: "bold" }}><span>ساعت : </span> <input type='number' value={editSessionHour} onChange={(e) => { setEditSessionHour(e.target.value) }} style={{ width: "30px" }}></input> <span>دقیقه : </span> <input type='number' value={editSessionMinute} onChange={(e) => { setEditSessionMinute(e.target.value) }} style={{ width: "30px" }}></input></p>
        <button className={styles.editSessionButton} onClick={() => { editSession() }}>ثبت با زمان جدید</button>
        <br></br>
        <br></br>
        <button className={styles.editSessionButton} onClick={() => { removeSession() }}>حذف کامل این فعالیت</button>
      </div>
    </main>
  )
}
