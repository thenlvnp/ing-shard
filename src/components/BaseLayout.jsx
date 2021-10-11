import { SearchIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import logo from "assets/img/shard-logo.png";
import AuthButton from "./AuthButton";
import CreatePost from "./CreatePost";

export default function BaseLayout({ title = "", children }) {
    return (
        <div className="h-full min-h-screen pb-10 bg-black lg:pb-24 lg:pt-24">
            <div
                aria-hidden="true"
                className="inset-x-0 top-0 w-full h-2 lg:absolute bg bg-brand-primary"
            />
            <div
                style={{ maxWidth: "77rem" }}
                className="w-full mx-auto md:px-10"
            >
                <header className="px-5 pt-3 space-y-4 lg:p-0">
                    <div className="flex items-center">
                        <div className="flex items-center flex-1 lg:space-x-14">
                            <Link to="/" className="flex-shrink-0">
                                <img
                                    className="w-auto h-10 lg:h-20"
                                    src={logo}
                                    alt="Shard"
                                />
                            </Link>
                            <form action="" className="hidden w-full lg:block">
                                <div className="relative w-1/2">
                                    <label
                                        htmlFor="search-posts-desktop"
                                        className="sr-only"
                                    >
                                        Search Posts
                                    </label>
                                    <input
                                        type="search"
                                        id="search-posts-desktop"
                                        placeholder="Search Shards..."
                                        className="pr-6 bg-black form-control"
                                    />
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-y-0 right-0 inline-flex items-center pr-4"
                                    >
                                        <SearchIcon className="w-5 h-5 text-gray-400" />
                                    </span>
                                </div>
                            </form>
                        </div>
                        <AuthButton />
                    </div>

                    <form action="" className="w-full lg:hidden">
                        <div className="relative w-full">
                            <label
                                htmlFor="search-posts-mobile"
                                className="sr-only"
                            >
                                Search Posts
                            </label>
                            <input
                                type="search"
                                id="search-posts-mobile"
                                placeholder="Search Shards..."
                                className="pr-6 bg-black form-control"
                            />
                            <span
                                aria-hidden="true"
                                className="absolute inset-y-0 right-0 inline-flex items-center pr-4"
                            >
                                <SearchIcon className="w-5 h-5 text-gray-400" />
                            </span>
                        </div>
                    </form>
                </header>
                <div className="mt-6 lg:mt-16">
                    {title ? (
                        <h2
                            className="hidden text-xl font-medium text-white lg:inline-block"
                            id={
                                title.toLocaleLowerCase().split(" ").join("_") +
                                "_label"
                            }
                        >
                            Popular Posts
                        </h2>
                    ) : null}
                    <div
                        className={`${
                            title ? "mt-8" : ""
                        } items-start flex-col-reverse lg:flex-row flex`}
                    >
                        {/* <aside className="w-full px-5 lg:hidden">
                            <CreatePost />
                        </aside> */}
                        <div className="w-full mt-10 lg:mt-0">
                            {title ? (
                                <h2
                                    className="px-5 text-xl font-medium text-white lg:hidden"
                                    id={
                                        title
                                            .toLocaleLowerCase()
                                            .split(" ")
                                            .join("_") + "_label"
                                    }
                                >
                                    Popular Posts
                                </h2>
                            ) : null}
                            <div className="mt-4 md:mt-0">{children}</div>
                        </div>
                        <aside className="w-full px-5 lg:w-auto md:pl-10 lg:pl-16 lg:px-0">
                            <CreatePost />
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
}
