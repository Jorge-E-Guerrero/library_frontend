"use client";

import Image from "next/image";
import Button from '@mui/material/Button';

import { redirect } from 'next/navigation'

export default function Home() {

  const loginEvent = async (e: any) => {
    e.preventDefault();
    redirect('/user');
  }


  return (
    <div className="root">

      <div className="button-container">
        <Button variant="contained" onClick={loginEvent}>Log In</Button>
      </div>
      
    </div>
  );
}
