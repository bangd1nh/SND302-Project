import React, { useEffect, useState } from "react";
import { countUser } from "../Services/statsService";

function StatusCard() {
    const [stats, setStats] = useState({
        totalUser: 0,
        totalBorrow: 0,
        totalBook: 0,
    });

    useEffect(() => {
        countUser().then((res) => {
            setStats((prevStats) => ({ ...prevStats, ...res.data }));
        });
        console.log(stats);
    }, []);
    return (
        <div className="bg-indigo-500 pt-12 sm:pt-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl ">
                        Platform Stats
                    </h2>
                </div>
            </div>
            <div className="mt-10  bg-white pb-12 sm:pb-16">
                <div className="relative">
                    <div className="absolute inset-0 h-1/2 bg-indigo-500"></div>
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl">
                            <dl className="rounded-lg  bg-indigo-800 shadow-lg sm:grid sm:grid-cols-3">
                                <div className="flex flex-col border-b border-gray-100  p-6 text-center sm:border-0 sm:border-r">
                                    <dt className="order-2 mt-2 text-lg font-normal leading-6 text-white">
                                        total User
                                    </dt>
                                    <dd className="order-1 text-5xl font-bold tracking-tight text-white ">
                                        <span>{stats.totalUser}</span>
                                    </dd>
                                </div>
                                <div className="flex flex-col border-t border-b border-gray-100  p-6 text-center sm:border-0 sm:border-l sm:border-r">
                                    <dt className="order-2 mt-2 text-lg font-normal leading-6 text-white ">
                                        total Book
                                    </dt>
                                    <dd className="order-1 text-5xl font-bold tracking-tight text-white ">
                                        <span>{stats.totalBook}</span>
                                    </dd>
                                </div>
                                <div className="flex flex-col border-t border-gray-100  p-6 text-center sm:border-0 sm:border-l">
                                    <dt className="order-2 mt-2 text-lg font-normal leading-6 text-white ">
                                        total Borrow request
                                    </dt>
                                    <dd className="order-1 text-5xl font-bold tracking-tight text-white ">
                                        <span>{stats.totalBorrow}</span>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatusCard;
