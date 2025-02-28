import React, { useEffect, useState } from "react";
import CategoryCard from "../component/CategoryCard";
import Books from "../component/Books";
import { getAllCategory } from "../Services/categoryService";
import Banner from "../component/Banner";

function LandingPage() {
    const [categoryName, setCategoryName] = useState([]);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        getAllCategory()
            .then((res) => {
                setCategoryName(res.data);
            })
            .catch((err) => console.log(err));

        getAllBooks()
            .then((res) => {
                console.log(res.data);
                setBooks(res.data);
            })
            .catch((err) => console.log(err));
    }, []);
    return (
        <div>
            <Banner />
            <CategoryCard categoryName={categoryName} />
            <Books books={books} />
        </div>
    );
}

export default LandingPage;
