import React, { useState } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/solid";

export default function Votes() {
    const [voteCount, setVoteCount] = useState(
        Math.floor(Math.random() * (10000 - 2 + 1) + 2)
    );
    const [selected, setSelected] = useState(null);
    function upvote() {
        if (selected === "UPVOTE") return;
        setSelected("UPVOTE");
        setVoteCount((p) => ++p);
    }
    function downvote() {
        if (selected === "DOWNVOTE") return;
        setSelected("DOWNVOTE");
        setVoteCount((p) => --p);
    }
    return (
        <div className="flex flex-col items-center space-y-3">
            <button
                onClick={upvote}
                title="Upvote post"
                className={`${
                    selected === "UPVOTE" ? "text-brand-primary" : "text-white"
                } focus:outline-none focus:ring-2 hover:text-brand-primary focus:ring-brand-primary`}
            >
                <span className="sr-only">Upvote Post</span>
                <ArrowUpIcon className="w-6 h-6 " />
            </button>
            <div className="text-base font-medium text-white lg:text-lg">
                {voteCount.toLocaleString("en-US")}
            </div>
            <button
                onClick={downvote}
                title="Downvote post"
                className={`${
                    selected === "DOWNVOTE"
                        ? "text-brand-primary"
                        : "text-white"
                }  focus:outline-none focus:ring-2 hover:text-brand-primary focus:ring-brand-primary `}
            >
                <span className="sr-only">Downvote Post</span>
                <ArrowDownIcon className="w-6 h-6 " />
            </button>
        </div>
    );
}
