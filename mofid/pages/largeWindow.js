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
* The component for displaying the large window error page
*/
export default function LargeWindow() {
  const router = useRouter();
  useEffect(() => {
    if (window.innerWidth < 785) {
      router.push("/");
    }
  }, []);
  return (
    <main style={{ textAlign: "center" }}>
      <Head>
        <title>mofidshim large window alert</title>
      </Head>
      <h1>این وب اپلکیشن در حال حاضر فقط برای صفحات موبایل طراحی شده است</h1>
      <h2>لطفا با موبایل وارد شوید</h2>
    </main>
  )
}
