import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { getBookByAuthorId } from "../Services/authorService";
import BookTable from "../component/BookTable";

function AdminAuthor() {
    const { authorId } = useParams();
    const { data: books, isLoading } = useQuery({
        queryFn: () => getBookByAuthorId(authorId).then((res) => res.data),
        queryKey: ["AUTHOR_ADMIN_BOOK", authorId],
    });
    console.log(books);
    if (isLoading) {
        return <div>...Loading</div>;
    }

    return <BookTable title={books.authorName} data={books.writenBook} />;
}

export default AdminAuthor;
