import { useEffect, useState } from "react";
import CategoryCard from "../component/CategoryCard";
import {
  getAllCategory,
  getBooksByCategoryId,
} from "../Services/categoryService";
import { useQuery } from "@tanstack/react-query";
import Books from "../component/Books";

function Category() {
  const [categoryName, setCategoryName] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("Category");
  const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
    getAllCategory()
      .then((res) => {
        setCategoryName(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const { data: books, isLoading } = useQuery({
    queryFn: () => {
      if (categoryId) {
        return getBooksByCategoryId(categoryId).then((res) => res.data.books);
      }
    },
    queryKey: ["categoryBooks", categoryId],
    enabled: !!categoryId,
  });

  if (isLoading) {
    return <div>loading....</div>;
  }

  const handleCallBack = (data) => {
    setCategoryId(() => data.categoryId);
    setCategoryTitle(() => data.categoryName);
  };

  return (
    <div className="mt-20">
      <CategoryCard categoryName={categoryName} callback={handleCallBack} />
      <div className="text-center text-3xl mt-10 font-semibold">
        {categoryTitle}
      </div>
      <Books books={books} />
    </div>
  );
}

export default Category;
