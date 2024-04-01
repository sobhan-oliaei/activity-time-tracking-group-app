"use client"
import Image from 'next/image'
import Head from 'next/head';
import styles from './forgetPassword.module.css'
import { useEffect, useState } from 'react';
import loginRegisterClass from '@/funs/loginRegisterClass';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import '../app/globals.css';

/**
* The component for displaying the forget password page
*/
export default function ForgetPassword() {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [passwordField, setPasswordField] = useState('');
  const [password2Field, setPassword2Field] = useState('');
  const loginCl = new loginRegisterClass();
  useEffect(() => {
    if (window.innerWidth > 785) {
      router.push("/largeWindow")
    }
  }, []);
  /**
  * a function that changes the user's password
  * runs after change password clicked
  */
  const changePassword = () => {
    loginCl.changePassword(router, passwordField, password2Field);
  }
  return (
    <main>
      <Head>
        <title>mofidshim login</title>
      </Head>
      <div className={styles.loginFormContainer}>
        <Image width={150} height={150} src="/login-icon.png" alt="Picture of the app" />
        <p className={styles.loginFormTitle}>مفید شیم</p>
        <input className={styles.loginFormInput} placeholder='رمز عبور جدید' type='password' value={passwordField} onChange={(e) => { setPasswordField(e.target.value) }}></input>
        <input className={styles.loginFormInput} placeholder='تکرار رمز عبور جدید' type='password' value={password2Field} onChange={(e) => { setPassword2Field(e.target.value) }}></input>
        <button className={styles.loginFormButton} onClick={() => { changePassword() }}>ذخیره رمز عبور جدید</button>
      </div>
    </main>
  )
}
