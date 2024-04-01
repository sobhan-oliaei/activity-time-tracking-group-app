"use client"
import Image from 'next/image'
import Head from 'next/head';
import styles from './index.module.css'
import { useEffect, useState } from 'react';
import loginRegisterClass from '@/funs/loginRegisterClass';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import '../app/globals.css';

/**
* The component for displaying the login page
*/
export default function LoginPage() {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [loginDivDisplay, setLoginDivDisplay] = useState('block');
  const [registerDivDisplay, setRegisterDivDisplay] = useState('none');
  const [forgetPasswordDivDisplay, setForgetPasswordDivDisplay] = useState('none');
  const [usernameField, setUsernameField] = useState('');
  const [passwordField, setPasswordField] = useState('');
  const [password2Field, setPassword2Field] = useState('');
  const [nameField, setNameField] = useState('');
  const [emailField, setEmailField] = useState('');
  const [email2Field, setEmail2Field] = useState('');
  const loginCl = new loginRegisterClass();
  useEffect(() => {
    if (window.innerWidth > 785) {
      router.push("/largeWindow")
    }
    else if (cookies.userid) {
      if (cookies.passwd) {
        loginCl.isLogged(cookies, router);
      }
    }
  }, []);

  /**
  * A function to run "register" from "loginClass" when register button clicked
  */
  const registerFun = () => {
    loginCl.register(usernameField, passwordField, password2Field, nameField, emailField, email2Field, setRegisterDivDisplay, setLoginDivDisplay, setUsernameField, setPasswordField, setNameField, setPassword2Field, setEmailField, setEmail2Field);
  }

  /**
  * A function to run "login" from "loginClass" when login button clicked
  */
  const loginFun = () => {
    loginCl.login(usernameField, passwordField, router, setCookie);
  }

  /**
  * A function to run "forgetPassword" from "loginClass" when forgetpassword button clicked
  */
  const forgetPasswordFun = () => {
    loginCl.forgetPassword(emailField, setEmailField, setLoginDivDisplay, setForgetPasswordDivDisplay);
  }
  // for myself : setLoginDivDisplay('none');setForgetPasswordDivDisplay("block") -> use it for lostPasswordButton later
  return (
    <main>
      <Head>
        <title>mofidshim login</title>
      </Head>
      <div className={styles.loginFormContainer} style={{ display: loginDivDisplay }}>
        <Image width={150} height={150} src="/login-icon.png" alt="Picture of the app" />
        <p className={styles.loginFormTitle}>مفید شیم</p>
        <input className={styles.loginFormInput} placeholder='نام کاربری' type='text' value={usernameField} onChange={(e) => { setUsernameField(e.target.value) }}></input>
        <input className={styles.loginFormInput} placeholder='رمز عبور' type='password' value={passwordField} onChange={(e) => { setPasswordField(e.target.value) }}></input>
        <button className={styles.loginFormButton} onClick={() => { loginFun() }}>ورود</button>
        <button className={styles.registerFormButton} onClick={() => { setLoginDivDisplay('none'); setRegisterDivDisplay('block'); setUsernameField(''); setPasswordField('') }}>ثبت نام</button>
        <p style={{ fontWeight: "bold" }} onClick={() => { setLoginDivDisplay('none'); setForgetPasswordDivDisplay("block") }}>رمز عبورم را فراموش کردم</p>
        <a href='/mofidshim.apk' style={{ textDecoration: "none", fontSize: "17px", backgroundColor: "orange", padding: "5px" }}>(native)دانلود اپلیکیشن</a>
      </div>
      <div className={styles.loginFormContainer} style={{ display: registerDivDisplay, minHeight: "90vh", marginTop: "5vh" }}>
        <Image width={150} height={150} src="/login-icon.png" alt="Picture of the app" />
        <p className={styles.loginFormTitle}>Mofid app</p>
        <input className={styles.loginFormInput} placeholder='نام نمایشی' type='text' value={nameField} onChange={(e) => { setNameField(e.target.value) }}></input>
        <input className={styles.loginFormInput} placeholder='نام کاربری' type='text' value={usernameField} onChange={(e) => { setUsernameField(e.target.value) }}></input>
        <input className={styles.loginFormInput} placeholder='رمز عبور' type='password' value={passwordField} onChange={(e) => { setPasswordField(e.target.value) }}></input>
        <input className={styles.loginFormInput} placeholder='تکرار رمز عبور' type='password' value={password2Field} onChange={(e) => { setPassword2Field(e.target.value) }}></input>
        <input className={styles.loginFormInput} placeholder='ایمیل' type='email' value={emailField} onChange={(e) => { setEmailField(e.target.value) }}></input>
        <input className={styles.loginFormInput} placeholder='تکرار ایمیل' type='email' value={email2Field} onChange={(e) => { setEmail2Field(e.target.value) }}></input>
        <button className={styles.loginFormButton} onClick={() => { registerFun() }}>ثبت نام</button>
        <button className={styles.registerFormButton} onClick={() => { setLoginDivDisplay('block'); setRegisterDivDisplay('none'); setUsernameField(''); setPasswordField(''); setNameField(''); setPassword2Field(''); setEmailField('') }}>ورود</button>
      </div>
      <div className={styles.loginFormContainer} style={{ display: forgetPasswordDivDisplay }}>
        <Image width={150} height={150} src="/login-icon.png" alt="Picture of the app" />
        <p className={styles.loginFormTitle}>مفید شیم</p>
        <input className={styles.loginFormInput} placeholder='ایمیل' type='email' value={emailField} onChange={(e) => { setEmailField(e.target.value) }}></input>
        <button className={styles.loginFormButton} onClick={() => { forgetPasswordFun() }}>بازیابی</button>
        <button className={styles.registerFormButton} onClick={() => { setForgetPasswordDivDisplay("none"); setLoginDivDisplay('block'); setEmailField(''); }}>ورود</button>
      </div>
    </main>
  )
}
