import Book from "../models/Book";

export const createBook = async (payload: any) => {
    payload.available = payload.quantity;
    return await Book.create(payload);
};

export const getBookById = async (id: number) => {
    const book = await Book.findByPk(id);
    if (!book) {
        throw new Error("Book not found");
    }
    return book;
};

export const getBookByISBN = async (ISBN: string) => {
    return await Book.findOne({ where: { ISBN } });
};

export const getAllBooks = async ({ title, author }: { title?: string, author?: string }) => {
    const where: any = {};
    //todo: search with fuzzy finder
    if (title) where.title = title;
    if (author) where.author = author;

    return await Book.findAll({ where: where });
};

export const updateBook = (bookId: number, book: any) => {
    if (!book && !bookId) {
        throw new Error("Please provide book data and book id to update");
    }
    if (book.id || bookId) {
        const id = book.id || bookId;
        return Book.update(book, { where: { id }, });
    }
};

export const deleteBook = (id: number) => {
    return Book.destroy({
        where: { id },
    });
};
