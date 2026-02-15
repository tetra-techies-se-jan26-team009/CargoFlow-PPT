import React, { useState } from "react";
import { Auth } from './Auth'


const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
};

const generateYears = (start = 1950) => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= start; y--) years.push(y);
    return years;
};

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];


const SignupForm = () => {
    const today = new Date();

    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1); // 1-12
    const [day, setDay] = useState(today.getDate());
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    const daysInMonth = getDaysInMonth(month, year);
    return (
        <div className="mx-auto max-w-[432px] bg-white rounded-md my-7 shadow-lg drop-shadow-md">
            <div className="px-4 py-3 flex justify-between">
                <div>
                    <h2 className="font-bold" style={{ fontSize: 32 }}>Sign Up</h2>
                    <p className="text-gray-500" style={{ fontSize: 15 }}>It's quick and easy.</p>
                </div>
                <div style={{ cursor: 'pointer' }} className="text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>
            <hr className="bg-gray-600" />
            <div className="px-4 pt-3 pb-6 space-y-3">
                <div className="space-x-3 flex">
                    <input type="text" placeholder="First name" className="flex-1 ring-1 ring-gray-400 rounded-md text-md px-2 py-2 outline-none bg-gray-100 focus:placeholder-gray-500" />
                    <input type="text" placeholder="Surname" className="flex-1 ring-1 ring-gray-400 rounded-md text-md px-2 py-2 outline-none bg-gray-100 focus:placeholder-gray-500" />
                </div>
                <div>
                    <input type="text" placeholder="Mobile number or email address" className="w-full ring-1 ring-gray-400 rounded-md text-md px-2 py-2 outline-none bg-gray-100 focus:placeholder-gray-500" />
                </div>
                <div>
                    <input type="password" placeholder="New password" className="w-full ring-1 ring-gray-400 rounded-md text-md px-2 py-2 outline-none bg-gray-100 focus:placeholder-gray-500" />
                </div>
                <div>
                    <div className="text-gray-500" style={{ fontSize: 12 }}>
                        Date of birth <a href> (?) </a>
                    </div>
                    <div className="mt-1 flex space-x-3">

                        {/* DAY */}
                        <select
                            value={day}
                            onChange={(e) => setDay(Number(e.target.value))}
                            className="text-md flex-1 px-1 py-1.5 ring-1 ring-gray-400 rounded-md outline-none"
                        >
                            {[...Array(daysInMonth)]
                                .map((_, i) => i + 1)
                                .filter((d) =>
                                    year < currentYear ||
                                    month < currentMonth ||
                                    d <= currentDay
                                )
                                .map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                        </select>

                        {/* MONTH */}
                        <select
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
                            className="text-md flex-1 px-1 py-1.5 ring-1 ring-gray-400 rounded-md outline-none"
                        >
                            {months
                                .map((m, i) => ({ name: m, value: i + 1 }))
                                .filter((m) => year < currentYear || m.value <= currentMonth)
                                .map((m) => (
                                    <option key={m.value} value={m.value}>{m.name}</option>
                                ))}
                        </select>

                        {/* YEAR */}
                        <select
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="text-md flex-1 px-1 py-1.5 ring-1 ring-gray-400 rounded-md outline-none"
                        >
                            {generateYears(1950)
                                .filter((y) => y <= currentYear)
                                .map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                        </select>

                    </div>
                </div>
                <div>
                    <div className="text-gray-500" style={{ fontSize: 12 }}>
                        Gender <a href> (?) </a>
                    </div>
                    <div className="mt-1 flex space-x-3">
                        <label htmlFor="female" className="flex-1 flex space-x-2 justify-between items-center rounded-md px-2 py-1 border border-gray-400">
                            <span>Female</span>
                            <input type="radio" id="female" name="gender" />
                        </label>
                        <label htmlFor="male" className="flex-1 flex space-x-2 justify-between items-center rounded-md px-2 py-1 border border-gray-400">
                            <span>Male</span>
                            <input type="radio" id="male" name="gender" />
                        </label>
                        <label htmlFor="other" className="flex-1 flex space-x-2 justify-between items-center rounded-md px-2 py-1 border border-gray-400">
                            <span>Custom</span>
                            <input type="radio" id="other" name="gender" />
                        </label>
                    </div>
                </div>
                <div>
                    <p className="text-gray-600" style={{ fontSize: 11 }}>
                        People who use our service may have uploaded your contact information to
                        Facebook.
                        <a href className="hover:text-blue-900 font-medium hover:underline">Learn more</a>.
                    </p>
                    <p className="text-gray-600 mt-4" style={{ fontSize: 11 }}>
                        By clicking Sign Up, you agree to our
                        <a href className="hover:text-blue-900 font-medium hover:underline">Terms</a>,
                        <a href className="hover:text-blue-900 font-medium hover:underline">Privacy Policy</a>
                        and
                        <a href className="hover:text-blue-900 font-medium hover:underline">Cookies Policy</a>. You may receive SMS notifications from us and can opt out at any
                        time.
                    </p>
                </div>
                <div className="text-center">
                    <button className="text-white font-bold px-16 py-1 rounded-md" style={{ backgroundColor: '#00A400', fontSize: 18 }}>
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Signup() {
    return (
        <Auth>
            <SignupForm />
        </Auth>
    );
}