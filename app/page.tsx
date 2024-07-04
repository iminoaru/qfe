'use client'

import {BGbeams} from "@/components/BGbeams";
import React from "react";
import {InfiniteCards} from "@/components/InfiniteCards";
import {WobbleCards} from "@/components/WobbleCards";
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
