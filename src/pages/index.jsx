import { ArrowRightIcon, ExclamationCircleIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import BaseLayout from "components/BaseLayout";
import Votes from "components/Votes";
import { useQuery } from "react-query";
import axios from "axios";
import { useState } from "react";

const usePosts = (pageNumber = 1) => {
    return useQuery(
        ["posts", pageNumber],

        () => {
            return axios(
                `https://jsonplaceholder.typicode.com/posts?_page=${pageNumber}&_limit=10&_embed=comments&_expand=user&_order=desc`
            );
        },
        {
            keepPreviousData: true,
            select: (res) => {
                const hasNextPage = res.headers.link.includes("next");
                return { posts: res.data, hasNextPage };
            },
        }
    );
};
export default function Home() {
    const [page, setPage] = useState(1);
    const {
        data: { posts, hasNextPage } = {},
        refetch,
        isLoading,
        isSuccess,
        isError,
    } = usePosts(page);
    function nextPage() {
        setPage((p) => ++p);
    }
    return (
        <BaseLayout title="Popular Posts">
            <main className="w-full mt-8 lg:mt-0">
                {isLoading ? (
                    <div className="w-full space-y-4 ">
                        {Array.from({ length: 4 }, (_, index) => (
                            <div
                                key={index}
                                className="px-6 py-16 bg-gray-300 rounded animate-pulse"
                            />
                        ))}
                    </div>
                ) : isSuccess ? (
                    <>
                        <ul
                            className="space-y-6 "
                            aria-labelledby="popular_posts_label"
                        >
                            {posts.map((post) => (
                                <li key={post.id}>
                                    <div className="relative flex items-start space-x-5 cursor-pointer lg:rounded bg-brand-secondary">
                                        <div className="flex-shrink-0 py-6 pl-6">
                                            <Votes />
                                        </div>
                                        <Link to={`/p/${post.id}`}>
                                            <article className="py-6 pr-6 group">
                                                <div className="space-y-2">
                                                    <div className="text-lg font-medium text-white lg:text-2xl group-hover:text-brand-primary">
                                                        {post.title}
                                                    </div>
                                                    <p className="text-base text-gray-400">
                                                        {post.body}
                                                    </p>
                                                    <ol
                                                        aria-label="Post information"
                                                        className="flex flex-wrap items-center space-x-1 text-xs text-gray-400"
                                                    >
                                                        <li>
                                                            {
                                                                post.comments
                                                                    .length
                                                            }{" "}
                                                            Comments
                                                        </li>
                                                        <li>
                                                            &middot;
                                                            <span className="ml-1">
                                                                Posted by{" "}
                                                                {
                                                                    post.user
                                                                        .username
                                                                }
                                                            </span>
                                                        </li>
                                                        <li>
                                                            &middot;
                                                            <span className="ml-1">
                                                                May 4, 2021
                                                            </span>
                                                        </li>
                                                    </ol>
                                                </div>
                                            </article>
                                        </Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {posts?.length && isLoading ? (
                            <div className="w-full pt-10 font-medium text-center text-gray-400 animate-bounce">
                                Loading more...
                            </div>
                        ) : null}
                        <nav className="px-5 mt-16 md:p-0">
                            {hasNextPage ? (
                                <button
                                    onClick={nextPage}
                                    className="btn btn-sm btn-secondary"
                                >
                                    <span>Next Page</span>
                                    <span aria-hidden="true">
                                        <ArrowRightIcon className="w-4 h-4 " />
                                    </span>
                                </button>
                            ) : (
                                <div className="w-full text-center text-gray-400">
                                    No more posts
                                </div>
                            )}
                        </nav>
                    </>
                ) : isError ? (
                    <div className="flex flex-col items-center w-full px-4 py-10 mt-8 rounded bg-brand-secondary">
                        <div className="flex items-center mb-4 space-x-1">
                            <span>
                                <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                            </span>
                            <p className="text-base font-medium text-red-500">
                                Error encountered. try again
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
            </main>
        </BaseLayout>
    );
}
