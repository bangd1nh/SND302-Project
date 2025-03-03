import Category from "../../models/category.js";

export const getAllCategory = async () => {
    const result = await Category.find();
    return {
        code: 200,
        payload: result,
    };
};

export const getCategory = async (categoryId) => {
    const result = await Category.findById(categoryId)
        .populate({
            path: "books",
            populate: {
                path: "authorId",
                select: "authorName",
            },
        })
        .select("categoryName");
    if (result) {
        return {
            code: 200,
            payload: result,
        };
    }
    return {
        code: 404,
        payload: null,
    };
};

export const updateCategory = async (categoryId, category) => {
    const result = await Category.findByIdAndUpdate(categoryId, category);
    if (result) {
        return {
            code: 200,
            payload: result,
        };
    }
    return {
        code: 404,
        payload: null,
    };
};

export const insertCategory = async (categoryName) => {
    const result = await Category.create({ categoryName: categoryName });
    return {
        code: 200,
        payload: result,
    };
};

export const deleteCategory = async (categoryId) => {
    const result = await Category.findByIdAndDelete(categoryId);
    if (!result) {
        return {
            code: 404,
            payload: null,
        };
    }
    return {
        code: 200,
        payload: result,
    };
};
