"use client"
import Image from 'next/image';
import Head from 'next/head';
import styles from './activity.module.css';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import '../app/globals.css';
import basicClass from '@/funs/basicClass';
import activitiesClass from '@/funs/activitiesClass';
import jobsClass from '@/funs/jobsClass';

/**
* The component for displaying the user's activities page
*/
export default function ActivityPage() {
  const basicCl = new basicClass();
  const activitiesCl = new activitiesClass();
  const jobsCl = new jobsClass();
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [history, setHistory] = useState({ day: [["", []]], month: [["", []]], week: [["", []]] });
  const [historyButtonColor, setHistoryButtonColor] = useState({
    dayColor: 'rgb(226, 242, 255)',
    weekColor: 'rgb(187, 224, 255)',
    monthColor: 'rgb(187, 224, 255)'
  });
  const [subDivIndexs, setSubDivIndexs] = useState({ day: 0, month: 0, week: 0 });
  const [subDivDate, setSubDivDate] = useState({ day: "0000-00-00", week: "0000-00-00", month: "0000-00-00" });
  const [jobsListPageDisplay, setJobsListPageDisplay] = useState("none");
  const [jobsList, setJobsList] = useState([]);
  const [jobsAddTooltipDisplay, setJobsAddTooltipDisplay] = useState("none");
  const [isInGroupOption, setIsInGroupOption] = useState("yes");
  const [addingJobName, setAddingJobName] = useState("");
  const [tasksListPageDisplay, setTasksListPageDisplay] = useState("none");
  const [tasksList, setTasksList] = useState([]);
  const [tasksAddTooltipDisplay, setTasksAddTooltipDisplay] = useState("none");
  const [addingTaskName, setAddingTaskName] = useState("");
  const [selectedTaskDay, setSelectedTaskDay] = useState(new Date());
  useEffect(() => {
    if (window.innerWidth > 785) {
      router.push("/largeWindow")
    }
    else {
      basicCl.isLogged(cookies, router);
    }

    activitiesCl.setPersonHistoryStateActivities(cookies, setHistory, setSubDivDate);
    jobsCl.setJobsListStateActivities(cookies, setJobsList);
    jobsCl.setTasksListStateActivities(cookies, setTasksList);
  }, []);

  /**
  * A function to return the <p> needed to display the user's history
  */
  const personHistoryP = (item, index) => {
    if (Number(item[1]) > 0 && Number(item[2]) <= 0) {
      return <p className={styles.personHistoryP}><span className={styles.personHistoryIndexSpan1}>{(index + 1)}</span><span className={styles.personHistoryIndexSpan2}>{item[0]}</span><span className={styles.personHistoryIndexSpan3} style={{ width: "40%" }}>{item[1] + " ساعت"}</span></p>;
    }
    else if (Number(item[1]) > 0 && Number(item[2]) > 0) {
      return <p className={styles.personHistoryP}><span className={styles.personHistoryIndexSpan1}>{(index + 1)}</span><span className={styles.personHistoryIndexSpan2}>{item[0]}</span><span className={styles.personHistoryIndexSpan3}>{item[1] + " ساعت"}</span><span className={styles.personHistoryIndexSpan4}>{item[2] + " دقیقه"}</span></p>;
    }
    else if (Number(item[1]) <= 0 && Number(item[2]) > 0) {
      return <p className={styles.personHistoryP}><span className={styles.personHistoryIndexSpan1}>{(index + 1)}</span><span className={styles.personHistoryIndexSpan2}>{item[0]}</span><span className={styles.personHistoryIndexSpan4} style={{ width: "40%" }}>{item[2] + " دقیقه"}</span></p>;
    }
  }

  /**
  * A function to return the "personHistoryP" needed to display the user's history
  */
  const personHistorySubDiv = () => {
    if (historyButtonColor.dayColor == 'rgb(226, 242, 255)') {
      if (history.day[subDivIndexs['day']]) {
        return history.day[subDivIndexs['day']][1].map((item, index) => { return personHistoryP(item, index) });
      }
    }
    else if (historyButtonColor.weekColor == 'rgb(226, 242, 255)') {
      if (history.week[subDivIndexs['week']]) {
        return history.week[subDivIndexs['week']][1].map((item, index) => { return personHistoryP(item, index) });
      }
    }
    else if (historyButtonColor.monthColor == 'rgb(226, 242, 255)') {
      if (history.month[subDivIndexs['month']]) {
        return history.month[subDivIndexs['month']][1].map((item, index) => { return personHistoryP(item, index) });
      }
    }
  }

  /**
  * A function to return the dates needed to display the user's history
  */
  const subDivDateSpan = () => {
    if (historyButtonColor.dayColor == 'rgb(226, 242, 255)') {
      return subDivDate.day
    }
    else if (historyButtonColor.weekColor == 'rgb(226, 242, 255)') {
      return subDivDate.week
    }
    else if (historyButtonColor.monthColor == 'rgb(226, 242, 255)') {
      return subDivDate.month
    }
  }

  /**
  * A function to return the active time of user to display the user's history
  */
  const subDivActiveTimeSpan = () => {
    if (historyButtonColor.dayColor == 'rgb(226, 242, 255)') {
      let sumHour = 0;
      let sumMinute = 0;
      if (history.day[subDivIndexs['day']]) {
        history.day[subDivIndexs['day']][1].map((item, index) => {
          sumHour = sumHour + Number(item[1]);
          sumMinute = sumMinute + Number(item[2]);
        });
      }
      while (sumMinute >= 60) {
        sumHour = sumHour + 1;
        sumMinute = sumMinute - 60;
      }
      if (sumHour < 10) {
        sumHour = "0" + String(sumHour);
      }
      else {
        sumHour = String(sumHour);
      }
      if (sumMinute < 10) {
        sumMinute = "0" + String(sumMinute);
      }
      else {
        sumMinute = String(sumMinute);
      }
      return sumHour + ":" + sumMinute;
    }
    else if (historyButtonColor.weekColor == 'rgb(226, 242, 255)') {
      let sumHour = 0;
      let sumMinute = 0;
      if (history.week[subDivIndexs['week']]) {
        history.week[subDivIndexs['week']][1].map((item, index) => {
          sumHour = sumHour + Number(item[1]);
          sumMinute = sumMinute + Number(item[2]);
        });
      }
      while (sumMinute >= 60) {
        sumHour = sumHour + 1;
        sumMinute = sumMinute - 60;
      }
      if (sumHour < 10) {
        sumHour = "0" + String(sumHour);
      }
      else {
        sumHour = String(sumHour);
      }
      if (sumMinute < 10) {
        sumMinute = "0" + String(sumMinute);
      }
      else {
        sumMinute = String(sumMinute);
      }
      return sumHour + ":" + sumMinute;
    }
    else if (historyButtonColor.monthColor == 'rgb(226, 242, 255)') {
      let sumHour = 0;
      let sumMinute = 0;
      if (history.month[subDivIndexs['month']]) {
        history.month[subDivIndexs['month']][1].map((item, index) => {
          sumHour = sumHour + Number(item[1]);
          sumMinute = sumMinute + Number(item[2]);
        });
      }
      while (sumMinute >= 60) {
        sumHour = sumHour + 1;
        sumMinute = sumMinute - 60;
      }
      if (sumHour < 10) {
        sumHour = "0" + String(sumHour);
      }
      else {
        sumHour = String(sumHour);
      }
      if (sumMinute < 10) {
        sumMinute = "0" + String(sumMinute);
      }
      else {
        sumMinute = String(sumMinute);
      }
      return sumHour + ":" + sumMinute;
    }
  }

  /**
  * A function to change the index of Information displayed
  * runs after arrows clicked
  */
  const changeIndex = (format, monthStep, weekStep, dayStep) => {
    if (historyButtonColor.dayColor == 'rgb(226, 242, 255)') {
      let day = basicCl.changePersianDate(subDivDate.day, 0, 0, dayStep, format);
      setSubDivDate({ day: day, week: subDivDate.week, month: subDivDate.month });
      let isDayFinded = false;
      history.day.map((item, index) => {
        if (item[0] == day && !isDayFinded) {
          setSubDivIndexs({ day: index, month: subDivIndexs['month'], week: subDivIndexs['week'] });
          isDayFinded = true;
        }
      });
      if (!isDayFinded) {
        setSubDivIndexs({ day: (history.day.length - 1), month: subDivIndexs['month'], week: subDivIndexs['week'] });
      }
    }
    else if (historyButtonColor.weekColor == 'rgb(226, 242, 255)') {
      let day = basicCl.changePersianDate(subDivDate.week, 0, 0, 7 * weekStep, format);
      setSubDivDate({ day: subDivDate.day, week: day, month: subDivDate.month });
      let isDayFinded = false;
      history.week.map((item, index) => {
        if (item[0] == day && !isDayFinded) {
          setSubDivIndexs({ day: subDivIndexs['day'], month: subDivIndexs['month'], week: index });
          isDayFinded = true;
        }
      });
      if (!isDayFinded) {
        setSubDivIndexs({ day: subDivIndexs['day'], month: subDivIndexs['month'], week: (history.week.length - 1) });
      }
    }
    else if (historyButtonColor.monthColor == 'rgb(226, 242, 255)') {
      let day = basicCl.changePersianDate(subDivDate.month, 0, monthStep, 0, format);
      setSubDivDate({ day: subDivDate.day, week: subDivDate.week, month: day });
      let isDayFinded = false;
      history.month.map((item, index) => {
        if (item[0] == day && !isDayFinded) {
          setSubDivIndexs({ day: subDivIndexs['day'], month: index, week: subDivIndexs['week'] });
          isDayFinded = true;
        }
      });
      if (!isDayFinded) {
        setSubDivIndexs({ day: subDivIndexs['day'], month: (history.month.length - 1), week: subDivIndexs['week'] });
      }
    }
  }

  /**
  * A function to display the days of the week in the user's history
  */
  const subDivDayOfWeekSpan = () => {
    if (historyButtonColor.dayColor == 'rgb(226, 242, 255)') {
      if (history.day[subDivIndexs['day']]) {
        return history.day[subDivIndexs['day']][2];
      }
    }
    else if (historyButtonColor.weekColor == 'rgb(226, 242, 255)') {
      if (history.week[subDivIndexs['week']]) {
        return " to " + basicCl.changePersianDate(subDivDate.week, 0, 0, 6, "add");
      }
    }
    else if (historyButtonColor.monthColor == 'rgb(226, 242, 255)') {
      if (history.month[subDivIndexs['month']]) {
        return " to " + basicCl.changePersianDate(basicCl.changePersianDate(subDivDate.month, 0, 1, 0, "add"), 0, 0, 1, "reduce");
      }
    }
  }

  /**
  * A function to return the <p> needed to display the user's tasks
  */
  const jobsListP = () => {
    return jobsList.map((item, index) => {
      if (item[1] == "yes") {
        return <p key={index} className={styles.jobsListP}><Image className={styles.deleteJobImage} onClick={() => { removeJob(item[0]) }} width={35} height={35} src="/close-icon.png" alt="remove icon" /><span className={styles.jobsListIndexSpan1}>{item[0]}</span> <span className={styles.jobsListIndexSpan2}><Image className={styles.groupJobImage} width={27} height={27} src="/yes-icon.png" alt="remove icon" /></span></p>;
      }
      else {
        return <p key={index} className={styles.jobsListP}><Image className={styles.deleteJobImage} onClick={() => { removeJob(item[0]) }} width={35} height={35} src="/close-icon.png" alt="remove icon" /><span className={styles.jobsListIndexSpan1}>{item[0]}</span> <span className={styles.jobsListIndexSpan2}><Image className={styles.groupJobImage} width={35} height={35} src="/no-icon.png" alt="remove icon" style={{ left: "calc(50% - 22.5px)" }} /></span></p>;
      }
    })
  }

  /**
  * A function to save a new work for user
  * runs after save new job clicked
  */
  const saveNewJob = () => {
    jobsCl.addNewJob(cookies, addingJobName, isInGroupOption, setAddingJobName, setIsInGroupOption, setJobsAddTooltipDisplay, setJobsList);
  }

  /**
  * A function to remove an old work of user
  * runs after remove job clicked
  */
  const removeJob = (job) => {
    jobsCl.deleteJob(cookies, job, setJobsList);
  }

  /**
  * A function to execute when user pick a different date in tasks date picker
  */
  const onChangeDatePicker = (date, input, isTyping) => {
    if (!isTyping) return setSelectedTaskDay(date);

    const strings = input.value.split("/");
    const numbers = strings.map(Number);
    const [year, month, day] = numbers;

    if (input.value && numbers.some((number) => isNaN(number))) {
      return false;
    }

    if (month > 12 || month < 0) return false;
    if (day < 0 || (date && day > date.day)) return false;
    if (strings.some((val) => val.startsWith("00"))) return false;

    setSelectedTaskDay(date);
  }

  /**
  * A function to save a new task for user
  * runs after save new task clicked
  */
  const saveNewTask = () => {
    jobsCl.addNewTask(cookies, selectedTaskDay, addingTaskName, setSelectedTaskDay, setAddingTaskName, setTasksAddTooltipDisplay, setTasksList);
  }

  /**
  * A function to remove a task of user
  * runs after remove task clicked
  */
  const removeTask = (task, date) => {
    jobsCl.deleteTask(cookies, task, date, setTasksList);
  }

  return (
    <main>
      <Head>
        <title>mofidshim activity</title>
      </Head>
      <div className={styles.historyDiv}>
        <button className={styles.historyButton} onClick={() => { setHistoryButtonColor({ dayColor: "rgb(226, 242, 255)", weekColor: "rgb(187, 224, 255)", monthColor: "rgb(187, 224, 255)" }); }} style={{ backgroundColor: historyButtonColor.dayColor }}>تاریخچه روزانه</button>
        <button className={styles.historyButton} onClick={() => { setHistoryButtonColor({ dayColor: "rgb(187, 224, 255)", weekColor: "rgb(226, 242, 255)", monthColor: "rgb(187, 224, 255)" }); }} style={{ backgroundColor: historyButtonColor.weekColor }}>تاریخچه هفتگی</button>
        <button className={styles.historyButton} onClick={() => { setHistoryButtonColor({ dayColor: "rgb(187, 224, 255)", weekColor: "rgb(187, 224, 255)", monthColor: "rgb(226, 242, 255)" }); }} style={{ backgroundColor: historyButtonColor.monthColor }}>تاریخچه ماهانه</button>
        <p className={styles.historyDateP}><span onClick={() => { changeIndex("reduce", 3, 4, 10) }}><Image width={15} height={15} src="/left-arrow.png" alt="next icon" /></span> <span onClick={() => { changeIndex("reduce", 2, 2, 5) }}><Image width={15} height={15} src="/left-arrow.png" alt="next icon" /></span> <span onClick={() => { changeIndex("reduce", 1, 1, 1) }}><Image width={15} height={15} src="/left-arrow.png" alt="next icon" /></span> <span>{subDivDateSpan()}</span> <span>{subDivDayOfWeekSpan()}</span> <span onClick={() => { changeIndex("add", 1, 1, 1) }}><Image width={15} height={15} src="/right-arrow.png" alt="next icon" /></span> <span onClick={() => { changeIndex("add", 2, 2, 5) }}><Image width={15} height={15} src="/right-arrow.png" alt="next icon" /></span> <span onClick={() => { changeIndex("add", 3, 4, 10) }}><Image width={15} height={15} src="/right-arrow.png" alt="next icon" /></span></p>
        <p>میزان فعالیت کل : <span>{subDivActiveTimeSpan()}</span></p>
        <div className={styles.personHistorySubDiv}>
          {personHistorySubDiv()}
        </div>
      </div>
      <div className={styles.editListsDiv}>
        <button className={styles.editListsButton} onClick={() => { setTasksListPageDisplay("block") }}>لیست یادآور کار ها</button>
        <button className={styles.editListsButton} onClick={() => { setJobsListPageDisplay("block") }}>لیست عناوین کار ها</button>
      </div>
      <div className={styles.menuDiv}>
        <div className={styles.menuSubDiv}><Image width={60} height={60} src="/home-icon.png" alt="home icon" onClick={() => { router.push('/home') }}></Image><span className={styles.menuSpan}>خانه</span></div>
        <div className={styles.menuSubDiv}><Image width={60} height={60} src="/works-icon.png" alt="works icon"></Image><span className={styles.menuSpan}>فعالیت</span></div>
        <div className={styles.menuSubDiv}><Image width={60} height={60} src="/group-icon.png" alt="group icon" onClick={() => { router.push('/group') }}></Image><span className={styles.menuSpan}>گروه</span></div>
        <div className={styles.menuSubDiv}><Image width={60} height={60} src="/sittings-icon.png" alt="sittings icon" onClick={() => { router.push('/sittings') }}></Image><span className={styles.menuSpan}>تنظیمات</span></div>
      </div>
      <div className={styles.jobsListPageDiv} style={{ display: jobsListPageDisplay }}>
        <Image className={styles.jobsListPageCloseImage} onClick={() => { setJobsListPageDisplay("none") }} width={70} height={70} src="/close-icon.png" alt="close icon" />
        <button onClick={() => { if (jobsAddTooltipDisplay != "inline") { setJobsAddTooltipDisplay("inline") } }} className={styles.editListsButton} style={{ marginTop: "23.5px" }}>اضافه کردن کار جدید
          <span className={styles.jobsAddButtonTooltip} style={{ display: jobsAddTooltipDisplay }}>
            <Image className={styles.jobsAddTooltipCloseImage} onClick={() => { setJobsAddTooltipDisplay("none") }} width={60} height={60} src="/close-icon.png" alt="close icon" />
            <input className={styles.jobsAddTooltipInput} type='text' placeholder='نام کار' value={addingJobName} onChange={(e) => { setAddingJobName(e.target.value) }}></input>
            <br></br>
            <label><input className={styles.jobsAddTooltipInput} type='radio' name="is_in_group" value="yes" checked={isInGroupOption === "yes"} onChange={(e) => { setIsInGroupOption(e.target.value) }}></input>ثبت در گروه</label>
            <br></br>
            <label><input className={styles.jobsAddTooltipInput} type='radio' name="is_in_group" value="no" checked={isInGroupOption === "no"} onChange={(e) => { setIsInGroupOption(e.target.value) }}></input>عدم ثبت در گروه</label>
            <br></br>
            <p className={styles.jobsAddTooltipButton} onClick={saveNewJob}>ثبت کار</p>
          </span>
        </button>
        <br></br>
        <br></br>
        <h2>لیست کار ها</h2>
        <p className={styles.jobsListP}><span className={styles.jobsListIndexSpan1}>نام کار</span> <span className={styles.jobsListIndexSpan2}>ثبت در گروه</span></p>
        {jobsListP()}
      </div>
      <div className={styles.jobsListPageDiv} style={{ display: tasksListPageDisplay }}>
        <Image className={styles.jobsListPageCloseImage} onClick={() => { setTasksListPageDisplay("none") }} width={70} height={70} src="/close-icon.png" alt="close icon" />
        <button onClick={() => { if (tasksAddTooltipDisplay != "inline") { setTasksAddTooltipDisplay("inline") } }} className={styles.editListsButton} style={{ marginTop: "23.5px" }}>اضافه کردن یادآور جدید
          <span className={styles.jobsAddButtonTooltip} style={{ display: tasksAddTooltipDisplay }}>
            <Image className={styles.jobsAddTooltipCloseImage} onClick={() => { setTasksAddTooltipDisplay("none") }} width={60} height={60} src="/close-icon.png" alt="close icon" />
            <input className={styles.jobsAddTooltipInput} type='text' placeholder='نام کار' value={addingTaskName} onChange={(e) => { setAddingTaskName(e.target.value) }}></input>
            <br></br>
            <br></br>
            <span>انتخاب تاریخ : </span>
            <br></br>
            <DatePicker calendar={persian} locale={persian_fa} calendarPosition="bottom-right" value={selectedTaskDay} onChange={(date, { input, isTyping }) => { onChangeDatePicker(date, input, isTyping) }} />
            <br></br>
            <p className={styles.jobsAddTooltipButton} onClick={saveNewTask}>ثبت یادآور</p>
          </span>
        </button>
        <br></br>
        <br></br>
        <h2>لیست یادآوری ها</h2>
        <p className={styles.jobsListP}><span className={styles.jobsListIndexSpan1}>کار</span> <span className={styles.jobsListIndexSpan2}>تاریخ</span></p>
        {tasksList.map((item, index) => <p key={index} className={styles.jobsListP}><Image className={styles.deleteJobImage} onClick={() => { removeTask(item[0], item[1]) }} width={35} height={35} src="/close-icon.png" alt="remove icon" /><span className={styles.jobsListIndexSpan1}>{item[0]}</span> <span className={styles.jobsListIndexSpan2}>{item[1]}</span></p>)}
      </div>
    </main>
  )
}
