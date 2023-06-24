import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Link from "next/link";
export default function Home() {
  return (
    <main>
      <Link
        href="/addyen"
        className="flex justify-center items-center w-12 h-12 rounded-full bg-[#060047] text-white text-2xl font-bold shadow focus:outline-none hover:bg-[#E90064] transition-colors duration-300"
      >
        +
      </Link>
    </main>
  );
}
