"use client";

import { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { PopoverGroup } from "@headlessui/react";
import { PopOver, DialogBox, LoginPopOver } from "./NavComponents";
import { Link } from "react-router-dom";
import { SERVICES, SOLUTIONS, COMPANY, PARTNER, LOGIN_OPTIONS } from "../utils/navigation";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    // <header className="relative z-50">
    //   <nav
    //     aria-label="Global"
    //     className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
    //   >
    //     <div className="flex sm:flex-1">
    //       <Link to="/" className="-m-1.5 p-1.5">
    //         <div className="text-accent font-bold text-lg tracking-wide">
    //           <span className="border border-accent px-2 mr-1 pb-1 text-sm">Cargo</span>
    //           Flow
    //         </div>
    //       </Link>
    //     </div>
    //     <div className="flex md:hidden">
    //       <button onClick={() => setMobileMenuOpen(true)}>
    //         <Bars3Icon className="size-6 text-black" />
    //       </button>

    //       <DialogBox
    //         open={mobileMenuOpen}
    //         onClose={() => setMobileMenuOpen(false)}
    //         sections={[
    //           { label: "Services", items: SERVICES },
    //           { label: "Solutions", items: SOLUTIONS },
    //           { label: "Partner", items: PARTNER },
    //           { label: "Company", items: COMPANY },
    //           { label: "Ship Now", items: LOGIN_OPTIONS },
    //         ]}
    //       />
    //       <hr />
    //     </div>
    //     <PopoverGroup className="hidden lg:flex items-center gap-x-10">
    //       <PopOver label="Services" items={SERVICES} />
    //       <PopOver label="Solutions" items={SOLUTIONS} />
    //       <PopOver label="Partner" items={PARTNER} />
    //       <PopOver label="Company" items={COMPANY} />
    //       <LoginPopOver items={LOGIN_OPTIONS} />

    //     </PopoverGroup>
    //   </nav>
    // </header>
    <header className="relative z-50 w-full">
      <nav className="flex w-full">

        {/* LEFT LOGO SECTION */}
        <div className="bg-[#0B1F3B] px-16 py-6 flex items-center min-w-[220px]">
          <Link to="/" className="text-white font-bold text-lg tracking-wide">
            <span className="border border-white px-2 mr-1 pb-1 text-lg">
              Cargo
            </span>
            Flow
          </Link>
        </div>

        {/* RIGHT NAVIGATION SECTION */}
        <div className="flex flex-1 items-center justify-end bg-white px-16 py-6 shadow-sm">

          <div className="flex md:hidden">
            <button onClick={() => setMobileMenuOpen(true)}>
              <Bars3Icon className="size-6 text-black" />
            </button>

            <DialogBox
              open={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
              sections={[
                { label: "Services", items: SERVICES },
                { label: "Solutions", items: SOLUTIONS },
                { label: "Partner", items: PARTNER },
                { label: "Company", items: COMPANY },
                { label: "Ship Now", items: LOGIN_OPTIONS },
              ]}
            />
            <hr />
          </div>
          <PopoverGroup className="hidden lg:flex items-center gap-x-10">
            <PopOver label="Services" items={SERVICES} />
            <PopOver label="Solutions" items={SOLUTIONS} />
            <PopOver label="Partner" items={PARTNER} />
            <PopOver label="Company" items={COMPANY} />
            <LoginPopOver items={LOGIN_OPTIONS} />

          </PopoverGroup>
        </div>

      </nav>
    </header>
  );
}
