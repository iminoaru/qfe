'use client'

import Image from "next/image";
import {BGbeams} from "@/components/BGbeams";
import React from "react";
import {InfiniteCards} from "@/components/InfiniteCards";
import ProblemListDemo from "@/components/questions/Datatable";
import {WobbleCards} from "@/components/WobbleCards";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
      <>
          <main>

              <BGbeams/>
              <WobbleCards/>
              <InfiniteCards/>

              <Footer />
          </main>
          <div></div>
      </>
  );
}
