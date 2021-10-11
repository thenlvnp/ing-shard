import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import {
    ArrowUpIcon,
    ArrowDownIcon,
    ExclamationCircleIcon,
    CheckCircleIcon,
} from "@heroicons/react/solid";
import BaseLayout from "components/BaseLayout";
import Votes from "components/Votes";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useParams } from "react-router";
import { useAuth } from "AuthContext";
import * as yup from "yup";

const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback.apply(null, args);
        }, wait);
    };
};

const commentSchema = yup.object().shape({
    comment: yup.string().trim().required("This field is required"),
});

const usePost = (id = 0) => {
    return useQuery(
        ["post", id],

        () => {
            return axios(
                `https://jsonplaceholder.typicode.com/posts/${id}?_embed=comments&_expand=user`
            );
        },
        {
            enabled: id !== 0 || !!id,
            select: (res) => res.data,
        }
    );
};
const useCreateComment = (id) => {
    return useMutation((formData) => {
        return axios.post(
            `https://jsonplaceholder.typicode.com/posts/${id}/comments`,
            formData,
            { headers: { "Content-type": "application/json; charset=UTF-8" } }
        );
    }, {});
};
export default function Post() {
    const { id } = useParams();

    const { data: post, refetch, isLoading, isError, isSuccess } = usePost(id);

    return (
        <BaseLayout>
            <main className="rounded bg-brand-secondary">
                {isLoading ? (
                    <div className="relative flex items-start px-6 pb-6 space-x-5 border-b border-gray-600 rounded cursor-pointer pt-7 ">
                        <div className="flex flex-col items-center space-y-3">
                            <button
                                disabled
                                title="Upvote post"
                                className="text-white focus:outline-none focus:ring-2 hover:text-brand-primary focus:ring-brand-primary"
                            >
                                <span className="sr-only">Upvote Post</span>
                                <ArrowUpIcon className="w-6 h-6 " />
                            </button>
                            <div className="p-4 bg-gray-300 rounded animate-pulse" />
                            <button
                                title="Downvote post"
                                disabled
                                className={`focus:outline-none focus:ring-2 text-white hover:text-brand-primary focus:ring-brand-primary `}
                            >
                                <span className="sr-only">Downvote Post</span>
                                <ArrowDownIcon className="w-6 h-6 " />
                            </button>
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="w-full p-3 bg-gray-400 rounded animate-pulse" />
                            <div className="w-full px-4 py-6 bg-gray-400 rounded animate-pulse" />
                            <div className="w-full p-2 bg-gray-300 rounded animate-pulse" />
                        </div>
                    </div>
                ) : isSuccess ? (
                    <div className="relative flex items-start px-6 pb-6 space-x-5 border-b border-gray-600 rounded cursor-pointer pt-7 ">
                        <Votes />
                        <div className="space-y-2">
                            <div className="text-lg font-medium text-white lg:text-2xl ">
                                {post.title}
                            </div>
                            <p className="text-base font-normal leading-6 text-gray-400">
                                {post.body}
                            </p>
                            <ul
                                aria-label="Post information"
                                className="flex items-center space-x-1 text-xs text-gray-400"
                            >
                                <li>{post.comments.length} Comments</li>
                                <li>
                                    &middot;
                                    <span className="ml-1">
                                        Posted by {post.user.username}
                                    </span>
                                </li>
                                <li>
                                    &middot;
                                    <span className="ml-1">May 4, 2021</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center w-full px-4 py-10 mt-8 rounded bg-brand-secondary">
                        <div className="flex items-center mb-4 space-x-1">
                            <span>
                                <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                            </span>
                            <p className="text-base font-medium text-red-500">
                                Error loading post. try again
                            </p>
                        </div>
                        <button
                            onClick={refetch}
                            className="bg-red-500 btn btn-sm hover:bg-red-400 focus:ring-red-600"
                        >
                            Try again
                        </button>
                    </div>
                ) : null}

                <section className="relative px-6 pt-8 pb-6">
                    <h3 className="sr-only">Comments</h3>

                    <div className="">
                        <PostComment postId={id} />
                        <div className="mt-12">
                            {isLoading ? (
                                <div className="space-y-4">
                                    {Array.from({ length: 4 }, (_, index) => (
                                        <div
                                            key={index}
                                            className="px-6 py-12 bg-gray-300 rounded animate-pulse"
                                        />
                                    ))}
                                </div>
                            ) : isSuccess ? (
                                <ul className="space-y-6">
                                    {post.comments.map((comment) => (
                                        <li key={comment.id}>
                                            <article>
                                                <header className="inline-flex items-center text-base text-white">
                                                    <span>user2</span>{" "}
                                                    <span className="mx-1">
                                                        &middot;
                                                    </span>
                                                    <span>{comment.email}</span>
                                                </header>
                                                <p className="mt-4 text-base text-gray-400">
                                                    {comment.body}
                                                </p>
                                                <div className="mt-2 text-xs text-gray-400">
                                                    May 12, 2021
                                                </div>
                                            </article>
                                        </li>
                                    ))}
                                </ul>
                            ) : isError ? (
                                <div className="flex flex-col items-center w-full px-4 py-10 mt-8 rounded bg-brand-secondary">
                                    <div className="flex items-center mb-4 space-x-1">
                                        <span>
                                            <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                                        </span>
                                        <p className="text-base font-medium text-red-500">
                                            Error loading comments. try again
                                        </p>
                                    </div>
                                    <button
                                        onClick={refetch}
                                        className="bg-red-500 btn btn-sm hover:bg-red-400 focus:ring-red-600"
                                    >
                                        Try again
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </section>
            </main>
        </BaseLayout>
    );
}
function PostComment({ postId }) {
    const { isLoggedIn } = useAuth();
    const queryClient = useQueryClient();
    const [formErrors, setFormErrors] = useState(null);
    const {
        mutate: addComment,
        isLoading,
        isSuccess,
        isError,
        reset,
    } = useCreateComment(postId);
    async function handleSubmit(e) {
        e.preventDefault();
        setFormErrors(null);
        const formData = new FormData(e.target);
        let body = {};
        formData.forEach((value, key) => {
            body[key] = value;
        });
        await commentSchema
            .validate(body, { abortEarly: false })
            .then((res) => {
                addComment(res, {
                    onSuccess: () => {
                        queryClient.invalidateQueries(["post", postId]);
                        debounce(reset, 4000);
                    },
                });
            })
            .catch((err) => {
                setFormErrors(
                    err.inner.reduce((prevValue, fieldError) => {
                        prevValue[fieldError.path] = fieldError.message;
                        return prevValue;
                    }, {})
                );
            });
    }
    return (
        <div className="relative">
            {!isLoggedIn ? (
                <div className="flex items-center w-full px-5 py-5 font-medium text-white rounded bg-brand-primary ">
                    <p>Login to post a comment</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <h3 className="text-base text-white">Posting as user2</h3>
                    <div>
                        {isError ? (
                            <div className="flex items-center px-4 py-2 mb-3 space-x-1 bg-red-100 rounded">
                                <span>
                                    <ExclamationCircleIcon className="w-6 h-6 text-red-500" />
                                </span>
                                <p className="text-base text-red-500">
                                    Failed to post comment, Try again
                                </p>
                            </div>
                        ) : null}
                        <form onSubmit={handleSubmit} action="">
                            <div className="relative">
                                <label
                                    className="sr-only"
                                    htmlFor="post-comment"
                                >
                                    Post Comment
                                </label>
                                <textarea
                                    name="comment"
                                    id="post-comment"
                                    cols="30"
                                    rows="4"
                                    placeholder="Post comment"
                                    className={`form-control ${
                                        formErrors?.comment ? "form-error" : ""
                                    }`}
                                />
                                {formErrors?.comment ? (
                                    <div className="mt-2 text-red-500">
                                        {formErrors?.comment}
                                    </div>
                                ) : null}
                            </div>
                            <div className="flex items-center mt-4 space-x-4">
                                <button
                                    className={`btn btn-md btn-primary ${
                                        isLoading ? "animate-pulse" : ""
                                    }`}
                                >
                                    {isLoading
                                        ? "Posting Comment..."
                                        : "Post Comment"}
                                </button>
                                <Transition
                                    show={isSuccess}
                                    enter="transition-opacity duration-75"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="transition-opacity duration-150"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="flex items-center space-x-1 text-white">
                                        <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                        <span>Comment Posted!</span>
                                    </div>
                                </Transition>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
