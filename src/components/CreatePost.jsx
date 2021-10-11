import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    PaperAirplaneIcon,
} from "@heroicons/react/solid";
import axios from "axios";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useLocation } from "react-router";
import * as yup from "yup";
import { useAuth } from "AuthContext";
const schema = yup.object().shape({
    title: yup.string().required("This field is required").trim(),
    body: yup.string().required("This field is required").trim(),
});
const useCreatePost = () => {
    return useMutation((formData) => {
        return axios.post(
            "https://jsonplaceholder.typicode.com/posts",
            formData,
            { headers: { "Content-type": "application/json; charset=UTF-8" } }
        );
    });
};
export default function CreatePost() {
    const [formErrors, setFormErrors] = useState({});
    const {
        mutate: addPost,
        isLoading,
        isIdle,
        isError,
        isSuccess,
        reset,
    } = useCreatePost();
    const queryClient = useQueryClient();
    const location = useLocation();
    const { isLoggedIn } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        setFormErrors(null);
        const formData = new FormData(e.target);
        let body = {};
        formData.forEach((value, key) => {
            body[key] = value;
        });
        await schema
            .validate(body, { abortEarly: false })
            .then((res) => {
                addPost(res, {
                    onSuccess: () => {
                        queryClient.invalidateQueries("posts");
                        setInterval(reset, 2000);
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
    if (!isLoggedIn) {
        return (
            <div className="p-5 rounded lg:w-96 lg:p-6 bg-brand-secondary">
                <div className="font-medium text-white">
                    Please login to create a post.
                </div>
            </div>
        );
    }
    return (
        <div className="p-5 rounded lg:w-96 lg:p-6 bg-brand-secondary">
            <div className="flex items-center space-x-3 text-white">
                <span className="transform rotate-90">
                    <PaperAirplaneIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                </span>
                <h2 className="text-2xl font-medium text-white ">
                    {location.pathname === "/"
                        ? "Create a Post"
                        : "Create a new Post"}
                </h2>
            </div>
            <div className="relative">
                {isLoading ? (
                    <div className="absolute inset-0 z-10 flex items-center justify-center w-full h-full bg-brand-secondary">
                        <p className="text-base text-center text-white animate-bounce">
                            Creating post...
                        </p>
                    </div>
                ) : isSuccess ? (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center w-full h-full space-y-2 text-lg text-white bg-brand-secondary">
                        <CheckCircleIcon className="w-10 h-10 text-green-500" />
                        <span>Post Created!</span>
                    </div>
                ) : isError ? (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center w-full h-full space-y-3 text-base text-white bg-brand-secondary">
                        <ExclamationCircleIcon className="w-10 h-10 text-red-500" />
                        <div className="space-y-2 text-center">
                            <p>Failed to create post. try again.</p>
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={reset}
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                ) : null}
                <form
                    onSubmit={handleSubmit}
                    className={`mt-6 ${!isIdle ? "opacity-0" : ""}`}
                >
                    <div className="space-y-4">
                        <div className="relative">
                            <label htmlFor="post-title" className="sr-only">
                                Post title
                            </label>
                            <input
                                type="text"
                                id="post-title"
                                name="title"
                                placeholder="Post title"
                                className={`form-control ${
                                    formErrors?.title
                                        ? "border-red-500 border"
                                        : ""
                                } `}
                            />
                            {formErrors?.title ? (
                                <div className="mt-2 text-red-500">
                                    {formErrors.title}
                                </div>
                            ) : null}
                        </div>
                        <div className="relative">
                            <label className="sr-only" htmlFor="post-content">
                                Post Content
                            </label>
                            <textarea
                                name="body"
                                id="post-content"
                                cols="30"
                                rows="5"
                                placeholder="Post content"
                                className={`form-control ${
                                    formErrors?.title
                                        ? "border-red-500 border"
                                        : ""
                                } `}
                            />
                            {formErrors?.body ? (
                                <div className="mt-2 text-red-500">
                                    {formErrors.body}
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className={`w-full btn btn-md btn-primary ${
                                location.pathname !== "/" ? "btn-outline" : ""
                            }`}
                        >
                            <span>Create Post</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
