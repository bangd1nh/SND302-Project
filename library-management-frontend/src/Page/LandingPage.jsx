import React, { useEffect, useState } from "react";
import CategoryCard from "../component/CategoryCard";
import Books from "../component/Books";
import { getAllCategory } from "../Services/categoryService";
import Banner from "../component/Banner";

function LandingPage() {
    const [categoryName, setCategoryName] = useState([]);

    useEffect(() => {
        getAllCategory()
            .then((res) => {
                setCategoryName(res.data);
            })
            .catch((err) => console.log(err));
    }, []);
    return (
        <div>
            <Banner />
            <CategoryCard categoryName={categoryName} />
        </div>
    );
}

export default LandingPage;
