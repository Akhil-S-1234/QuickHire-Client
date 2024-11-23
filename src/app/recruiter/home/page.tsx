'use client'

import Image from "next/image"
import Header from "../components/Header"

export default function Component() {
  return (
    <div>
      <Header />

      <div className="min-h-[500px] w-full bg-white px-4 py-12 md:py-16 lg:py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Find your next great{" "}
              <span className="text-[#5D5FEF]">hire</span> today!
            </h1>
            <button
              className="mt-8 bg-[#5D5FEF] px-8 py-3 text-lg font-semibold text-white rounded-md hover:bg-[#5558E6] transition-colors duration-200"
            >
              Post Job
            </button>
          </div>
          <div className="relative h-[300px] w-full max-w-[500px] md:h-[400px]">
            <Image
              src="https://quickhireimg.s3.eu-north-1.amazonaws.com/images/hard_to_fill.jpg"
              alt="Illustration of people reviewing job candidates"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}