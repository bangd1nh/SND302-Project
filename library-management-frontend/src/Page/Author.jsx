import React, { useEffect, useState } from "react";
import AuthorCard from "../component/AuthorCard";
import { getAllAuthor, getBookByAuthorId } from "../Services/authorService";
import { useQuery } from "@tanstack/react-query";
import Books from "../component/Books";

function Author() {
    const [authors, setAuthors] = useState([]);
    const [authorId, setAuthorId] = useState("");
    const [authorName, setAuthorName] = useState("");
    useEffect(
        () =>
            getAllAuthor()
                .then((res) => setAuthors(res.data))
                .then((err) => console.log(err)),
        []
    );
    const handleCallBack = (data) => {
        setAuthorId(() => data.authorId);
        setAuthorName(() => data.authorName);
    };
    const { data: books, isLoading } = useQuery({
        queryFn: () => {
            if (authorId) {
                return getBookByAuthorId(authorId).then(
                    (res) => res.data.writenBook
                );
            }
        },
        queryKey: ["categoryBooks", authorId],
        enabled: !!authorId,
    });
    return (
        <div className="mt-20">
            <AuthorCard authors={authors} callback={handleCallBack} />
            <div className="text-center font-semibold text-3xl mt-20">
                {authorName}
            </div>
            <Books books={books} />
        </div>
    );
}

export default Author;
