import React from "react";
import { useParams } from "react-router-dom";
import BookTable from "../component/BookTable";
import { useQuery } from "@tanstack/react-query";
import { getBooksByCategoryId } from "../Services/categoryService";

function CategoryComponent() {
    const { categoryId } = useParams();
    const {
        data: books,
        isLoading,
        isError,
    } = useQuery({
        queryFn: () => getBooksByCategoryId(categoryId).then((res) => res.data),
        queryKey: ["ADMINCATEGORYBOOKS", categoryId],
    });
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Fail...</div>;
    }

    // console.log(categoryId);
    console.log(books);
    return (
        <BookTable
            data={books.books}
            title={books.categoryName}
            elementId={categoryId}
        />
    );
}

export default CategoryComponent;
