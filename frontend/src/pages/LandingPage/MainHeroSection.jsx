"use client";

export function MainHeroSection() {
  return (
    <div className="">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-10">
          <div className="text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-text sm:text-6xl leading-tight">
              Experience Hassle-Free <br />
              <div className="text-primary">
              Logistics Solution</div>
            </h1>
            <p className="mt-8 text-pretty text-lg font-medium sm:text-xl/8">
              Say GoodBye to logistics Headache with Company's reliable and
              efficient solutions. From Warehousing to DoorStep delivery, we've
              got you covered every step of the way.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </a>
              <a href="#" className="text-sm/6 font-semibold text-gray-800">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
