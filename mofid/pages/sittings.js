"use client"
import Image from 'next/image';
import Head from 'next/head';
import styles from './sittings.module.css';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import '../app/globals.css';
import basicClass from '@/funs/basicClass';
import sittingsClass from '@/funs/sittingsClass';
import groupClass from '@/funs/groupClass';

/**
* The component for displaying the sittings page
*/
export default function SittingsPage() {
  const basicCl = new basicClass();
  const sittingsCl = new sittingsClass();
  const groupCl = new groupClass();
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [changePasswordPageDisplay, setChangePasswordPageDisplay] = useState("none");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [changeEmailPageDisplay, setChangeEmailPageDisplay] = useState("none");
  const [oldEmail, setOldEmail] = useState("");
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [groupSittingsListDisplay, setGroupSittingsListDisplay] = useState("none");
  const [groupAdminSittingsListDisplay, setGroupAdminSittingsListDisplay] = useState("none");
  useEffect(() => {
    if (window.innerWidth > 785) {
      router.push("/largeWindow")
    }
    else {
      basicCl.isLogged(cookies, router);
    }
    sittingsCl.setOldEmailStateSittings(cookies, setOldEmail);
    groupCl.isGroupAdminSittings(cookies, setGroupAdminSittingsListDisplay);
    groupCl.isInGroupSittings(cookies, setGroupSittingsListDisplay);
  }, []);

  /**
  * A function to run "changePassword" from "sittingsClass" when change password button clicked
  */
  const changePassword = () => {
    sittingsCl.changePassword(cookies, oldPassword, newPassword, newPassword2, setOldPassword, setNewPassword, setNewPassword2, setChangePasswordPageDisplay);
  }

  /**
  * A function to run "changeEmail" from "sittingsClass" when change email button clicked
  */
  const changeEmail = () => {
    sittingsCl.changeEmail(cookies, email, email2, setEmail, setEmail2, setChangeEmailPageDisplay);
  }

  /**
  * A function to logout user and delete user cookies on browser
  */
  const logOut = () => {
    setCookie("userid", '', { maxAge: 1209600 });
    setCookie("passwd", '', { maxAge: 1209600 });
    router.push('/');
  }

  /**
  * A function to run "exitGroup" from "groupClass" when exit group button clicked
  */
  const exitGroup = () => {
    groupCl.exitGroup(cookies, setGroupSittingsListDisplay, setGroupAdminSittingsListDisplay);
  }

  /**
  * A function to run "changeGroupCode" from "groupClass" when change group invitation code button clicked
  */
  const changeGroupCode = () => {
    groupCl.changeGroupCode(cookies);
  }

  return (
    <main>
      <Head>
        <title>mofidshim sittings</title>
      </Head>
      <div className={styles.sittingsDiv}>
        <h3 className={styles.sittingsH3}>تنظیمات حساب</h3>
        <p className={styles.sittingsP} onClick={() => { setChangePasswordPageDisplay("block") }}>تغییر رمز عبور</p>
        <p className={styles.sittingsP} onClick={() => { setChangeEmailPageDisplay("block") }}>تغییر ایمیل</p>
        <p className={styles.sittingsP} onClick={() => { logOut() }} style={{ marginBottom: "45px" }}>خروج از حساب</p>
        <h3 className={styles.sittingsH3} style={{ display: groupSittingsListDisplay }}>تنظیمات گروه</h3>
        <p className={styles.sittingsP} onClick={() => { alert("به زودی ..") }} style={{ display: groupSittingsListDisplay }}>درخواست رای گیری</p>
        <p className={styles.sittingsP} onClick={() => { exitGroup() }} style={{ display: groupSittingsListDisplay }}>خروج از گروه</p>
        <p className={styles.sittingsP} onClick={() => { changeGroupCode() }} style={{ display: groupAdminSittingsListDisplay }}>تغییر کد دعوت گروه</p>
        <p className={styles.sittingsP} onClick={() => { alert("به زودی ..") }} style={{ display: groupAdminSittingsListDisplay }}>مدیریت اعضای گروه</p>
      </div>
      <div className={styles.changePasswordPageDiv} style={{ display: changePasswordPageDisplay }}>
        <Image className={styles.changePasswordPageCloseImage} onClick={() => { setChangePasswordPageDisplay("none") }} width={70} height={70} src="/close-icon.png" alt="close icon" />
        <div className={styles.changePasswordFormDiv}>
          <input className={styles.changePasswordInput} type='password' placeholder='رمز فعلی' value={oldPassword} onChange={(e) => { setOldPassword(e.target.value) }}></input>
          <br></br>
          <input className={styles.changePasswordInput} type='password' placeholder='رمز جدید' value={newPassword} onChange={(e) => { setNewPassword(e.target.value) }}></input>
          <br></br>
          <input className={styles.changePasswordInput} type='password' placeholder='تکرار رمز جدید' value={newPassword2} onChange={(e) => { setNewPassword2(e.target.value) }}></input>
          <br></br>
          <button className={styles.changePasswordButton} onClick={changePassword}>تغییر رمز عبور</button>
        </div>
      </div>
      <div className={styles.changePasswordPageDiv} style={{ display: changeEmailPageDisplay }}>
        <Image className={styles.changePasswordPageCloseImage} onClick={() => { setChangeEmailPageDisplay("none") }} width={70} height={70} src="/close-icon.png" alt="close icon" />
        <div className={styles.changePasswordFormDiv}>
          <p style={{ direction: "rtl" }}>ایمیل فعلی : {oldEmail}</p>
          <input className={styles.changePasswordInput} type='email' placeholder='ایمیل جدید' value={email} onChange={(e) => { setEmail(e.target.value) }}></input>
          <br></br>
          <input className={styles.changePasswordInput} type='email' placeholder='تکرار ایمیل جدید' value={email2} onChange={(e) => { setEmail2(e.target.value) }}></input>
          <br></br>
          <button className={styles.changePasswordButton} onClick={changeEmail}>تغییر ایمیل</button>
        </div>
      </div>
      <div className={styles.menuDiv}>
        <div className={styles.menuSubDiv}><Image width={60} height={60} src="/home-icon.png" alt="home icon" onClick={() => { router.push('/home') }}></Image><span className={styles.menuSpan}>خانه</span></div>
        <div className={styles.menuSubDiv}><Image width={60} height={60} src="/works-icon.png" alt="works icon" onClick={() => { router.push('/activity') }}></Image><span className={styles.menuSpan}>فعالیت</span></div>
        <div className={styles.menuSubDiv}><Image width={60} height={60} src="/group-icon.png" alt="group icon" onClick={() => { router.push('/group') }}></Image><span className={styles.menuSpan}>گروه</span></div>
        <div className={styles.menuSubDiv}><Image width={60} height={60} src="/sittings-icon.png" alt="sittings icon"></Image><span className={styles.menuSpan}>تنظیمات</span></div>
      </div>
    </main>
  )
}
