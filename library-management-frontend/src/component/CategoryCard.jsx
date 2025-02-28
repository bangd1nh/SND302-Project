import React, { useEffect, useState } from "react";
import "../style.scss";
import { getAllCategory } from "../Services/categoryService";
import { Link } from "react-router-dom";

function CategoryCard({ categoryName, callback }) {
    const sendCallBack = (categoryId, categoryName) => {
        const data = {
            categoryId: categoryId,
            categoryName: categoryName,
        };
        callback(data);
    };
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3 lg:gap-8 p-4 me-40 ms-40">
            {categoryName.map((c, index) => {
                return (
                    <button
                        className=" rounded-lg category-card bg-indigo-400  shadow-xl justify-items-start"
                        key={index}
                        onClick={() => sendCallBack(c._id, c.categoryName)}
                    >
                        <h1 className="p-4 text-2xl category-card__title font-bold ">
                            {c.categoryName}
                        </h1>
                        <div className="pt-0 p-4 flex gap-1 category-card__title category-card__icon ">
                            Next
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                            >
                                <path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586z"></path>
                            </svg>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

export default CategoryCard;
