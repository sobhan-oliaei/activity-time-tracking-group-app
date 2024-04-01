"use client"
import Image from 'next/image';
import Head from 'next/head';
import styles from './group.module.css';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import '../app/globals.css';
import basicClass from '@/funs/basicClass';
import groupClass from '@/funs/groupClass';

/**
* The component for displaying the group page
*/
export default function GroupPage() {
  const basicCl = new basicClass();
  const groupCl = new groupClass();
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [outGroupDivDisplay, setOutGroupDivDisplay] = useState("none");
  const [inGroupDivDisplay, setInGroupDivDisplay] = useState("none");
  const [createGroupPageDisplay, setCreateGroupPageDisplay] = useState("none");
  const [createGroupName, setCreateGroupName] = useState("");
  const [joinGroupPageDisplay, setJoinGroupPageDisplay] = useState("none");
  const [joinGroupCode, setJoinGroupCode] = useState("");
  const [history, setHistory] = useState({ day: [["", []]], month: [["", []]], week: [["", []]] });
  const [historyButtonColor, setHistoryButtonColor] = useState({
    dayColor: 'rgb(226, 242, 255)',
    weekColor: 'rgb(187, 224, 255)',
    monthColor: 'rgb(187, 224, 255)'
  });
  const [subDivIndexs, setSubDivIndexs] = useState({ day: 0, month: 0, week: 0 });
  const [subDivDate, setSubDivDate] = useState({ day: "0000-00-00", week: "0000-00-00", month: "0000-00-00" });
  const [personListPageDisplay, setPersonListPageDisplay] = useState("none");
  const [personIndex, setPersonIndex] = useState(0);
  const [personName, setPersonName] = useState(0);
  const [groupCode, setGroupCode] = useState("");
  const [groupCodeTooltipDisplay, setGroupCodeTooltipDisplay] = useState("none");
  useEffect(() => {
    if (window.innerWidth > 785) {
      router.push("/largeWindow")
    }
    else {
      basicCl.isLogged(cookies, router);
    }
    groupCl.isInGroupGroup(cookies, setOutGroupDivDisplay, setInGroupDivDisplay, setHistory, setGroupCode, setSubDivDate);
  }, []);

  /**
  * a function to create a group
  * runs after create group bottun clicked
  */
  const createGroup = () => {
    groupCl.createGroup(cookies, createGroupName, setCreateGroupPageDisplay, setOutGroupDivDisplay, setInGroupDivDisplay, setHistory, setGroupCode, setSubDivDate);
  }

  /**
  * a function to join a group
  * runs after join group bottun clicked
  */
  const joinGroup = () => {
    groupCl.joinGroup(cookies, joinGroupCode, setJoinGroupPageDisplay, setOutGroupDivDisplay, setInGroupDivDisplay, setHistory, setGroupCode, setSubDivDate);
  }

  /**
  * A function to return the "groupHistoryP" needed to display the group's history
  */
  const groupHistorySubDiv = () => {
    if (historyButtonColor.dayColor == 'rgb(226, 242, 255)') {
      if (history.day[subDivIndexs['day']]) {
        return history.day[subDivIndexs['day']][1].map((item, index) => {
          let hour = 0;
          let minute = 0;
          if (item) {
            for (let i = 0; i < item[1].length; i++) {
              hour = hour + item[1][i][1];
              minute = minute + item[1][i][2];
            }
          }
          while (minute >= 60) {
            hour = hour + 1;
            minute = minute - 60;
          }
          if (item) {
            return groupHistoryP(item[0], index, hour, minute)
          }
        });
      }
    }
    else if (historyButtonColor.weekColor == 'rgb(226, 242, 255)') {
      if (history.week[subDivIndexs['week']]) {
        return history.week[subDivIndexs['week']][1].map((item, index) => {
          let hour = 0;
          let minute = 0;
          if (item) {
            for (let i = 0; i < item[1].length; i++) {
              hour = hour + item[1][i][1];
              minute = minute + item[1][i][2];
            }
          }
          while (minute >= 60) {
            hour = hour + 1;
            minute = minute - 60;
          }
          if (item) {
            return groupHistoryP(item[0], index, hour, minute)
          }
        });
      }
    }
    else if (historyButtonColor.monthColor == 'rgb(226, 242, 255)') {
      if (history.month[subDivIndexs['month']]) {
        return history.month[subDivIndexs['month']][1].map((item, index) => {
          let hour = 0;
          let minute = 0;
          if (item) {
            for (let i = 0; i < item[1].length; i++) {
              hour = hour + item[1][i][1];
              minute = minute + item[1][i][2];
            }
          }
          while (minute >= 60) {
            hour = hour + 1;
            minute = minute - 60;
          }
          if (item) {
            return groupHistoryP(item[0], index, hour, minute)
          }
        });
      }
    }
  }

  /**
  * A function to return the <p> needed to display the group's history
  */
  const groupHistoryP = (name, index, hour, minute) => {
    if (Number(hour) > 0 && Number(minute) <= 0) {
      return <p className={styles.groupHistoryP} onClick={() => { setPersonIndex(index); setPersonName(name); setPersonListPageDisplay("block") }}><span className={styles.groupHistoryIndexSpan1}>{(index + 1)}</span><span className={styles.groupHistoryIndexSpan2}>{name}</span><span className={styles.groupHistoryIndexSpan3} style={{ width: "40%" }}>{hour + " ساعت"}</span></p>;
    }
    else if (Number(hour) > 0 && Number(minute) > 0) {
      return <p className={styles.groupHistoryP} onClick={() => { setPersonIndex(index); setPersonName(name); setPersonListPageDisplay("block") }}><span className={styles.groupHistoryIndexSpan1}>{(index + 1)}</span><span className={styles.groupHistoryIndexSpan2}>{name}</span><span className={styles.groupHistoryIndexSpan3}>{hour + " ساعت"}</span><span className={styles.groupHistoryIndexSpan4}>{minute + " دقیقه"}</span></p>;
    }
    else if (Number(hour) <= 0 && Number(minute) > 0) {
      return <p className={styles.groupHistoryP} onClick={() => { setPersonIndex(index); setPersonName(name); setPersonListPageDisplay("block") }}><span className={styles.groupHistoryIndexSpan1}>{(index + 1)}</span><span className={styles.groupHistoryIndexSpan2}>{name}</span><span className={styles.groupHistoryIndexSpan4} style={{ width: "40%" }}>{minute + " دقیقه"}</span></p>;
    }
  }

  /**
  * A function to return the dates needed to display the group's history
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
          setSubDivIndexs({ day: subDivIndexs['day'], month: index, week: subDivIndexs['month'] });
          isDayFinded = true;
        }
      });
      if (!isDayFinded) {
        setSubDivIndexs({ day: subDivIndexs['day'], month: (history.month.length - 1), week: subDivIndexs['week'] });
      }
    }
  }

  /**
  * A function to display the days of the week in the group's history
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
  * A function to return the "groupHistoryP" needed to display the user's history
  */
  const personHistorySubDiv = () => {
    if (historyButtonColor.dayColor == 'rgb(226, 242, 255)') {
      if (history.day[subDivIndexs['day']]) {
        if (history.day[subDivIndexs['day']][1][personIndex]) {
          return history.day[subDivIndexs['day']][1][personIndex][1].map((item, index) => {
            return groupHistoryP(item[0], index, item[1], item[2])
          });
        }
      }
    }
    else if (historyButtonColor.weekColor == 'rgb(226, 242, 255)') {
      if (history.week[subDivIndexs['week']]) {
        if (history.week[subDivIndexs['week']][1][personIndex]) {
          return history.week[subDivIndexs['week']][1][personIndex][1].map((item, index) => {
            return groupHistoryP(item[0], index, item[1], item[2])
          });
        }
      }
    }
    else if (historyButtonColor.monthColor == 'rgb(226, 242, 255)') {
      if (history.month[subDivIndexs['month']]) {
        if (history.month[subDivIndexs['month']][1][personIndex]) {
          return history.month[subDivIndexs['month']][1][personIndex][1].map((item, index) => {
            return groupHistoryP(item[0], index, item[1], item[2])
          });
        }
      }
    }
  }

  return (
    <main>
      <Head>
        <title>mofidshim group</title>
      </Head>
      <div className={styles.outGroupDiv} style={{ display: outGroupDivDisplay }}>
        <h2>شما گروهی ندارید</h2>
        <button className={styles.outGroupButton} onClick={() => { setJoinGroupPageDisplay("block") }}>ورود به گروه</button>
        <button className={styles.outGroupButton} onClick={() => { setCreateGroupPageDisplay("block") }}>ساخت گروه</button>
      </div>
      <div className={styles.createGroupPageDiv} style={{ display: createGroupPageDisplay }}>
        <Image className={styles.createGroupPageCloseImage} onClick={() => { setCreateGroupPageDisplay("none") }} width={70} height={70} src="/close-icon.png" alt="close icon" />
        <div className={styles.createGroupFormDiv}>
          <input className={styles.createGroupInput} type='text' placeholder='نام گروه' value={createGroupName} onChange={(e) => { setCreateGroupName(e.target.value) }}></input>
          <br></br>
          <button className={styles.createGroupButton} onClick={createGroup}>ساخت گروه</button>
        </div>
      </div>
      <div className={styles.createGroupPageDiv} style={{ display: joinGroupPageDisplay }}>
        <Image className={styles.createGroupPageCloseImage} onClick={() => { setJoinGroupPageDisplay("none") }} width={70} height={70} src="/close-icon.png" alt="close icon" />
        <div className={styles.createGroupFormDiv}>
          <input className={styles.createGroupInput} type='text' placeholder='کد گروه' value={joinGroupCode} onChange={(e) => { setJoinGroupCode(e.target.value) }}></input>
          <br></br>
          <button className={styles.createGroupButton} onClick={joinGroup}>ورود به گروه</button>
        </div>
      </div>
      <div className={styles.inGroupDiv} style={{ display: inGroupDivDisplay }}>
        <div className={styles.groupHistoryDiv}>
          <button className={styles.groupHistoryButton} onClick={() => { setHistoryButtonColor({ dayColor: "rgb(226, 242, 255)", weekColor: "rgb(187, 224, 255)", monthColor: "rgb(187, 224, 255)" }); }} style={{ backgroundColor: historyButtonColor.dayColor }}>تاریخچه روزانه</button>
          <button className={styles.groupHistoryButton} onClick={() => { setHistoryButtonColor({ dayColor: "rgb(187, 224, 255)", weekColor: "rgb(226, 242, 255)", monthColor: "rgb(187, 224, 255)" }); }} style={{ backgroundColor: historyButtonColor.weekColor }}>تاریخچه هفتگی</button>
          <button className={styles.groupHistoryButton} onClick={() => { setHistoryButtonColor({ dayColor: "rgb(187, 224, 255)", weekColor: "rgb(187, 224, 255)", monthColor: "rgb(226, 242, 255)" }); }} style={{ backgroundColor: historyButtonColor.monthColor }}>تاریخچه ماهانه</button>
          <p className={styles.groupHistoryDateP}><span onClick={() => { changeIndex("reduce", 3, 4, 10) }}><Image width={15} height={15} src="/left-arrow.png" alt="next icon" /></span> <span onClick={() => { changeIndex("reduce", 2, 2, 5) }}><Image width={15} height={15} src="/left-arrow.png" alt="next icon" /></span> <span onClick={() => { changeIndex("reduce", 1, 1, 1) }}><Image width={15} height={15} src="/left-arrow.png" alt="next icon" /></span> <span>{subDivDateSpan()}</span> <span>{subDivDayOfWeekSpan()}</span> <span onClick={() => { changeIndex("add", 1, 1, 1) }}><Image width={15} height={15} src="/right-arrow.png" alt="next icon" /></span> <span onClick={() => { changeIndex("add", 2, 2, 5) }}><Image width={15} height={15} src="/right-arrow.png" alt="next icon" /></span> <span onClick={() => { changeIndex("add", 3, 4, 10) }}><Image width={15} height={15} src="/right-arrow.png" alt="next icon" /></span></p>
          <div className={styles.groupHistorySubDiv}>
            {groupHistorySubDiv()}
          </div>
        </div>
        <div className={styles.groupButtonsDiv}>
          <button className={styles.groupButton} onClick={() => { alert("به زودی ..") }}>اتاق گفتگو</button>
          <button className={styles.groupButton} onClick={() => { alert("به زودی ..") }}>اعضای گروه</button>
        </div>
        <div>
          <p className={styles.groupCodeP} onClick={() => { navigator.clipboard.writeText(groupCode); setGroupCodeTooltipDisplay("inline"); setTimeout(() => { setGroupCodeTooltipDisplay("none") }, 3000) }}>کد دعوت گروه : {groupCode} <span className={styles.groupCodeTooltip} style={{ display: groupCodeTooltipDisplay }}>کد کپی شد</span></p>
        </div>
        <div className={styles.createGroupPageDiv} style={{ display: personListPageDisplay }}>
          <Image className={styles.createGroupPageCloseImage} onClick={() => { setPersonListPageDisplay("none") }} width={70} height={70} src="/close-icon.png" alt="close icon" />
          <div className={styles.groupHistoryDiv}>
            <h3>جزئیات فعالیت {personName}</h3>
            <p className={styles.groupHistoryDateP}><span>{subDivDateSpan()}</span> <span>{subDivDayOfWeekSpan()}</span></p>
            <div className={styles.groupHistorySubDiv}>
              {personHistorySubDiv()}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.menuDiv}>
        <div className={styles.menuSubDiv}><Image width={60} height={60} src="/home-icon.png" alt="home icon" onClick={() => { router.push('/home') }}></Image><span className={styles.menuSpan}>خانه</span></div>
        <div className={styles.menuSubDiv}><Image width={60} height={60} src="/works-icon.png" alt="works icon" onClick={() => { router.push('/activity') }}></Image><span className={styles.menuSpan}>فعالیت</span></div>
        <div className={styles.menuSubDiv}><Image width={60} height={60} src="/group-icon.png" alt="group icon"></Image><span className={styles.menuSpan}>گروه</span></div>
        <div className={styles.menuSubDiv}><Image width={60} height={60} src="/sittings-icon.png" alt="sittings icon" onClick={() => { router.push('/sittings') }}></Image><span className={styles.menuSpan}>تنظیمات</span></div>
      </div>
    </main>
  )
}
