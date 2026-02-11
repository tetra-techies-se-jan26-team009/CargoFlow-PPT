import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from "@headlessui/react";
import { Dialog,DialogPanel,Disclosure,DisclosureButton,DisclosurePanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/20/solid";

export function PopOver({ label, items }) {
    return (
        <PopoverGroup>
            <Popover className="relative">
                {({ open }) => (
                    <div
                        onMouseEnter={(e) => {
                            const btn = e.currentTarget.querySelector("button");
                            btn?.click();
                        }}
                        onMouseLeave={(e) => {
                            const btn = e.currentTarget.querySelector("button");
                            btn?.click();
                        }}
                        className="relative"
                    >
                        <PopoverButton className="relative flex items-center gap-x-1 text-lg/6 font-semibold text-white focus:outline-none">
                            <span>{label}</span>

                            {/* UNDERLINE */}
                            <span
                                className={`
                              absolute left-0 -bottom-1 h-[2px] w-full bg-indigo-500
                              transition-all duration-300
                              ${open ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}
                              origin-left
                              `}
                            />
                        </PopoverButton>

                        <PopoverPanel
                            transition
                            className="absolute left-1/2 z-10 mt-3 w-screen max-w-md 
                  -translate-x-1/2 overflow-hidden rounded-3xl bg-white shadow-lg 
                  outline outline-1 outline-gray-900/5
                  data-[closed]:translate-y-1 data-[closed]:opacity-0"
                        >
                            <div className="p-4">
                                {items.map((item) => (
                                    <div
                                        key={item.name}
                                        className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                                    >
                                        {/* <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                            <item.icon
                                                aria-hidden="true"
                                                className="size-6 text-gray-600 group-hover:text-indigo-600"
                                            />
                                        </div> */}
                                        <div className="flex-auto">
                                            <a
                                                href={item.href}
                                                className="block font-semibold text-gray-900"
                                            >
                                                {item.name}
                                                <span className="absolute inset-0" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PopoverPanel>
                    </div>
                )}
            </Popover>
        </PopoverGroup>
    );
};

export function DialogBox({ open, onClose, sections = [] }) {
  return (
    <Dialog open={open} onClose={onClose} className="lg:hidden">
      <div className="fixed inset-0 z-50 bg-black/30" />

      <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={onClose}>
            <XMarkIcon className="size-6" />
          </button>
        </div>

        {/* Accordion Sections */}
        <div className="mt-6 space-y-4">
          {sections.map((section) => (
            <Disclosure key={section.label} as="div">
              {({ open }) => (
                <>
                  {/* Section Header */}
                  <DisclosureButton className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left font-semibold text-gray-900 hover:bg-gray-50">
                    <span>{section.label}</span>
                    <ChevronDownIcon
                      className={`size-5 transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </DisclosureButton>

                  {/* Section Items */}
                  <DisclosurePanel className="mt-2 space-y-1 pl-4">
                    {section.items.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block rounded-md px-2 py-1 text-gray-700 hover:bg-gray-100"
                        onClick={onClose}
                      >
                        {item.name}
                      </a>
                    ))}
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export function LoginPopOver({ items }) {
  return (
    <PopoverGroup>
      <Popover className="relative">
        {({ open }) => (
          <div
            onMouseEnter={(e) => {
              const btn = e.currentTarget.querySelector("button");
              btn?.click();
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget.querySelector("button");
              btn?.click();
            }}
            className="relative"
          >
            {/* LOGIN BUTTON */}
            <PopoverButton
              className="relative flex items-center gap-x-2 rounded-md
                         bg-white px-4 py-2 text-sm font-semibold
                         text-black shadow-sm focus:outline-none"
            >
              <span className="text-md font-bold font-serif">Ship Now</span>

              {/* ARROW */}
              {open ? (
                <ChevronUpIcon className="size-4 transition-transform" />
              ) : (
                <ChevronDownIcon className="size-4 transition-transform" />
              )}
            </PopoverButton>

            {/* POPOVER PANEL */}
            <PopoverPanel
              transition
              className="absolute right-0 z-10 mt-3 w-56
                         overflow-hidden rounded-xl bg-white shadow-lg
                         ring-1 ring-gray-900/5
                         data-[closed]:translate-y-1
                         data-[closed]:opacity-0"
            >
              <div className="py-2">
                {items.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-sm font-medium
                               text-gray-800 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </PopoverPanel>
          </div>
        )}
      </Popover>
    </PopoverGroup>
  );
}