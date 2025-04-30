import Book from "../../../models/Book";
import sequelize from "../../../db/connection";

describe("Book Model", () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a book successfully", async () => {
        const bookData = {
            title: "Test Book",
            author: "Test Author",
            ISBN: "1234567890",
            quantity: 5,
            available: 5,
            shelfLocation: "location",
        };

        const book = await Book.create(bookData);
        expect(book.id).toBeDefined();
        expect(book.title).toBe(bookData.title);
        expect(book.author).toBe(bookData.author);
        expect(book.ISBN).toBe(bookData.ISBN);
        expect(book.quantity).toBe(bookData.quantity);
        expect(book.available).toBe(bookData.available);
        expect(book.shelfLocation).toBe(bookData.shelfLocation);
    });

    it("should not allow duplicate ISBN", async () => {
        const bookData = {
            title: "Another Book",
            author: "Another Author",
            ISBN: "1234567890", // Same ISBN as previous test
            quantity: 3,
        };

        // Using try/catch to verify the validation error
        try {
            await Book.create(bookData);
            // If it reaches here, no error was thrown, so fail the test
            fail("Expected uniqueness constraint error was not thrown");
        } catch (error: any) {
            expect(error.name).toBe("SequelizeValidationError");
        }
    });

    it("should update book quantity", async () => {
        const book = await Book.findOne({ where: { ISBN: "1234567890" } });
        if (!book) {
            fail("Test book not found");
            return;
        }

        const newQuantity = 10;
        book.quantity = newQuantity;
        await book.save();

        const updatedBook = await Book.findByPk(book.id);
        expect(updatedBook?.quantity).toBe(newQuantity);
    });
});
