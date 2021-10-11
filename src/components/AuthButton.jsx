import { Dialog, Transition, Menu } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import {
    ChevronDownIcon,
    ExclamationCircleIcon,
    UserIcon,
    XIcon,
} from "@heroicons/react/solid";
import { useAuth } from "AuthContext";
import * as yup from "yup";

const schema = yup.object().shape({
    username: yup
        .string()
        .test("is a valid username", "Username not found", function (value) {
            const userId = +value.trim()[value.length - 1];
            return Boolean(userId);
        })
        .required("This field is required")
        .trim(),
    password: yup.string().required("This field is required").trim(),
});

export default function AuthButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState("IDLE");
    const { user, loginUser } = useAuth();
    const [formErrors, setFormErrors] = useState(null);

    function closeModal() {
        setIsOpen(false);
        setFormErrors(null);
    }

    function openModal() {
        setIsOpen(true);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setFormErrors(null);
        setStatus("LOADING");
        const formData = new FormData(e.target);
        let body = {};
        formData.forEach((value, key) => {
            body[key] = value;
        });
        schema
            .validate(body, { abortEarly: false })
            .then(async (res) => {
                const userId = +res.username.trim()[res.username.length - 1];

                const [loginSuccess, error] = await loginUser(userId);
                if (loginSuccess) {
                    closeModal();
                    setStatus("SUCCESS");
                } else if (error) setStatus("ERROR");
            })
            .catch((err) => {
                setStatus("IDLE");
                setFormErrors(
                    err.inner.reduce((prevValue, fieldError) => {
                        prevValue[fieldError.path] = fieldError.message;
                        return prevValue;
                    }, {})
                );
            });
    }

    if (user?.id) {
        return <User />;
    }
    return (
        <>
            <button onClick={openModal} className="btn btn-sm btn-secondary">
                <span>
                    <svg
                        className="w-4 h-4"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M8 2C9.1 2 10 2.9 10 4C10 5.1 9.1 6 8 6C6.9 6 6 5.1 6 4C6 2.9 6.9 2 8 2ZM8 12C10.7 12 13.8 13.29 14 14H2C2.23 13.28 5.31 12 8 12ZM8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z"
                            fill="white"
                        />
                    </svg>
                </span>
                <span>Login</span>
            </button>

            <Transition show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={closeModal}
                >
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform rounded shadow-xl bg-brand-secondary ">
                                <div className="flex justify-end">
                                    <button
                                        onClick={closeModal}
                                        className="w-auto space-x-0 text-white focus:ring-2 focus:ring-brand-primary btn"
                                    >
                                        <span className="sr-only ">Close</span>
                                        <span aria-hidden="false">
                                            <XIcon className="w-6 h-6" />
                                        </span>
                                    </button>
                                </div>
                                <div>
                                    <Dialog.Title
                                        as="h3"
                                        className="inline-flex space-x-2 text-lg font-medium text-white"
                                    >
                                        <span>
                                            <UserIcon className="w-6 h-6 " />
                                        </span>
                                        <span className="font-medium ">
                                            Login
                                        </span>
                                    </Dialog.Title>
                                    <p className="text-base text-white">
                                        Login to Shards to discuss topics with
                                        the community.
                                    </p>
                                </div>

                                <div className="mt-7">
                                    {status === "ERROR" ? (
                                        <div className="flex items-center px-4 py-2 mb-3 space-x-1 bg-red-100 rounded">
                                            <span>
                                                <ExclamationCircleIcon className="w-6 h-6 text-red-500" />
                                            </span>
                                            <p className="text-base text-red-500">
                                                Failed to login, Try again.
                                            </p>
                                        </div>
                                    ) : null}
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label
                                                htmlFor="username"
                                                className="sr-only"
                                            >
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                id="username"
                                                name="username"
                                                placeholder="Username"
                                                className={`form-control ${
                                                    formErrors?.username
                                                        ? "border-red-500 border"
                                                        : ""
                                                } `}
                                            />
                                            {formErrors?.username ? (
                                                <div className="mt-2 text-red-500">
                                                    {formErrors.username}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="password"
                                                className="sr-only"
                                            >
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                placeholder="Password"
                                                className={`form-control ${
                                                    formErrors?.password
                                                        ? "border-red-500 border"
                                                        : ""
                                                } `}
                                            />
                                            {formErrors?.password ? (
                                                <div className="mt-2 text-red-500">
                                                    {formErrors.password}
                                                </div>
                                            ) : null}
                                        </div>
                                        <button
                                            className="w-full btn btn-primary btn-md"
                                            type="submit"
                                        >
                                            {status === "LOADING"
                                                ? "Logging in..."
                                                : "Login"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
function User() {
    const { logoutUser, user } = useAuth();

    return (
        <div className="z-10 text-right w-44">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="inline-flex items-center justify-center w-full px-4 py-2 text-base font-medium text-white bg-black rounded-md md:text-xl bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-brand-primary">
                        {user.username}
                        <ChevronDownIcon
                            className="w-6 h-6 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
                            aria-hidden="true"
                        />
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 mt-2 origin-top-right rounded shadow-lg w-44 bg-brand-secondary ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={logoutUser}
                                        className={`${
                                            active
                                                ? "bg-brand-primary font-medium bg-opacity-80  "
                                                : ""
                                        } text-left px-6  w-full py-3 text-base text-white`}
                                    >
                                        Logout
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
}
