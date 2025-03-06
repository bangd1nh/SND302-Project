import React, { useEffect, useState } from "react";
import CategoryCard from "../component/CategoryCard";
import Books from "../component/Books";
import { getAllCategory } from "../Services/categoryService";
import Banner from "../component/Banner";
import AuthorCard from "../component/AuthorCard";
import { getAllAuthor } from "../Services/authorService";

function LandingPage() {
    const [categoryName, setCategoryName] = useState([]);
    const [authors, setAuthors] = useState([]);
    useEffect(() => {
        getAllCategory()
            .then((res) => {
                setCategoryName(res.data);
            })
            .catch((err) => console.log(err));

        getAllAuthor()
            .then((res) => setAuthors(res.data))
            .catch((err) => console.log(err));
    }, []);
    return (
        <div>
            <Banner />
            <div className="text-center font-semibold text-4xl text-gray-800 mb-10">
                Explore our categories
            </div>
            <CategoryCard categoryName={categoryName} />
            <div className="text-center font-semibold text-4xl text-gray-800 mb-10 mt-20">
                Authors
            </div>
            <AuthorCard authors={authors} />
        </div>
    );
}

export default LandingPage;
