import React from "react";

function AuthorCard({ authors, callback }) {
    const sendCallBack = (authorId, authorName) => {
        const data = {
            authorId: authorId,
            authorName: authorName,
        };
        callback(data);
    };
    return (
        <div className="antialiased text-gray-900 ">
            <div className="bg-gray-200 p-10 grid grid-cols-4 gap-10">
                {authors.map((au, index) => {
                    return (
                        <div
                            className="bg-white rounded-lg shadow-2xl group overflow-hidden transition-transform duration-300 hover:translate-y-[-10px]"
                            key={index}
                            onClick={() => sendCallBack(au._id, au.authorName)}
                        >
                            <div className="h-48 w-full overflow-hidden">
                                <img
                                    className="h-full w-full object-cover transform overflow-hidden transition-transform duration-[300ms] group-hover:scale-125 object-fit"
                                    src={au.imgUrl}
                                />
                            </div>

                            <div className="p-6 pb-4 group-hover:bg-indigo-800 duration-[0.3s]">
                                <div className="mt-1">
                                    <span className="text-2xl font-semibold group-hover:text-white">
                                        {au.authorName}
                                    </span>
                                </div>

                                <p className="Card-info text-gray-500 mt-2 group-hover:text-white">
                                    {au.description}
                                </p>

                                <div className="mt-2 flex items-center">
                                    <span className=" text-gray-600 text-sm">
                                        {au.writenBook.length} books
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default AuthorCard;
