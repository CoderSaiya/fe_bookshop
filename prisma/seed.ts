const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    console.log("Start seeding...");

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);

    const adminUser = await prisma.user.upsert({
        where: { email: "admin@bookstore.com" },
        update: {},
        create: {
            email: "admin@bookstore.com",
            name: "Admin User",
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    console.log("Created admin user:", adminUser);

    // Create categories
    const categories = [
        {
            name: "Fiction",
            nameVi: "Tiểu thuyết",
            slug: "fiction",
            description: "Fictional literature and novels",
            image: "https://images.unsplash.com/photo-1532012197267-da84d127e765",
        },
        {
            name: "Non-Fiction",
            nameVi: "Phi hư cấu",
            slug: "non-fiction",
            description: "Educational and factual books",
            image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
        },
        {
            name: "Science & Technology",
            nameVi: "Khoa học & Công nghệ",
            slug: "science-technology",
            description: "Books about science, technology, and innovation",
            image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
        },
        {
            name: "Business & Economics",
            nameVi: "Kinh doanh & Kinh tế",
            slug: "business-economics",
            description: "Business, economics, and management books",
            image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
        },
        {
            name: "History",
            nameVi: "Lịch sử",
            slug: "history",
            description: "Historical books and biographies",
            image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
        },
        {
            name: "Children & Young Adults",
            nameVi: "Trẻ em & Thiếu niên",
            slug: "children-young-adults",
            description: "Books for children and young adults",
            image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
        },
    ];

    const createdCategories = [];
    for (const category of categories) {
        const createdCategory = await prisma.category.upsert({
            where: { slug: category.slug },
            update: {},
            create: category,
        });
        createdCategories.push(createdCategory);
        console.log("Created category:", createdCategory.name);
    }

    // Create publishers
    const publishers = [
        {
            name: "Penguin Random House",
            nameVi: "Penguin Random House",
            description: "World's largest trade book publisher",
            website: "https://www.penguinrandomhouse.com",
        },
        {
            name: "HarperCollins",
            nameVi: "HarperCollins",
            description: "American publishing company",
            website: "https://www.harpercollins.com",
        },
        {
            name: "Simon & Schuster",
            nameVi: "Simon & Schuster",
            description: "American publishing house",
            website: "https://www.simonandschuster.com",
        },
        {
            name: "Macmillan Publishers",
            nameVi: "Macmillan Publishers",
            description: "British publishing company",
            website: "https://www.macmillan.com",
        },
    ];

    const createdPublishers = [];
    for (const publisher of publishers) {
        const createdPublisher = await prisma.publisher.upsert({
            where: { name: publisher.name },
            update: {},
            create: publisher,
        });
        createdPublishers.push(createdPublisher);
        console.log("Created publisher:", createdPublisher.name);
    }

    // Create authors
    const authors = [
        {
            name: "Stephen King",
            nameVi: "Stephen King",
            bio: "American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels.",
            nationality: "American",
        },
        {
            name: "J.K. Rowling",
            nameVi: "J.K. Rowling",
            bio: "British author, philanthropist, producer, and screenwriter, best known for writing the Harry Potter fantasy series.",
            nationality: "British",
        },
        {
            name: "Agatha Christie",
            nameVi: "Agatha Christie",
            bio: "English writer known for her detective novels, especially those featuring Hercule Poirot and Miss Marple.",
            nationality: "British",
        },
        {
            name: "George Orwell",
            nameVi: "George Orwell",
            bio: "English novelist, essayist, journalist and critic whose work is marked by lucid prose, awareness of social injustice.",
            nationality: "British",
        },
        {
            name: "Paulo Coelho",
            nameVi: "Paulo Coelho",
            bio: "Brazilian lyricist and novelist, best known for his novel The Alchemist.",
            nationality: "Brazilian",
        },
        {
            name: "Yuval Noah Harari",
            nameVi: "Yuval Noah Harari",
            bio: "Israeli historian and professor, known for his books on history and the future of humanity.",
            nationality: "Israeli",
        },
        {
            name: "Eric Ries",
            nameVi: "Eric Ries",
            bio: "American entrepreneur and author of The Lean Startup methodology.",
            nationality: "American",
        },
        {
            name: "Robert C. Martin",
            nameVi: "Robert C. Martin",
            bio: "American software engineer and author, also known as Uncle Bob.",
            nationality: "American",
        },
        {
            name: "J.D. Salinger",
            nameVi: "J.D. Salinger",
            bio: "American writer known for his novel The Catcher in the Rye.",
            nationality: "American",
        },
        {
            name: "Daniel Kahneman",
            nameVi: "Daniel Kahneman",
            bio: "Israeli-American psychologist and economist, Nobel Prize winner.",
            nationality: "Israeli-American",
        },
        {
            name: "Delia Owens",
            nameVi: "Delia Owens",
            bio: "American author and zoologist, known for Where the Crawdads Sing.",
            nationality: "American",
        },
        {
            name: "J.R.R. Tolkien",
            nameVi: "J.R.R. Tolkien",
            bio: "English writer, poet, and professor, best known for The Hobbit and The Lord of the Rings.",
            nationality: "British",
        },
    ];

    const createdAuthors = [];
    for (const author of authors) {
        // Check if author already exists
        const existingAuthor = await prisma.author.findFirst({
            where: { name: author.name },
        });

        let createdAuthor;
        if (existingAuthor) {
            createdAuthor = existingAuthor;
        } else {
            createdAuthor = await prisma.author.create({
                data: author,
            });
        }

        createdAuthors.push(createdAuthor);
        console.log("Created author:", createdAuthor.name);
    }

    // Create sample books
    const books = [
        {
            title: "The Shining",
            titleVi: "Tỏa Sáng",
            isbn: "9780307743657",
            description:
                "A horror novel about a family isolated in a haunted hotel during the winter.",
            descriptionVi:
                "Một tiểu thuyết kinh dị về một gia đình bị cô lập trong một khách sạn ma ám trong mùa đông.",
            price: 299000,
            salePrice: 249000,
            coverImage: "/placeholder/400x400.svg",
            pageCount: 447,
            language: "en",
            stock: 50,
            featured: true,
            categoryId: createdCategories[0].id, // Fiction
            publisherId: createdPublishers[0].id,
            authorNames: ["Stephen King"],
            images: [
                "https://tse2.mm.bing.net/th/id/OIP.-7JMt1_-H5EnI56bYN_pzwHaLQ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
            ],
        },
        {
            title: "Harry Potter and the Philosopher's Stone",
            titleVi: "Harry Potter và Hòn Đá Phù Thủy",
            isbn: "9780747532699",
            description:
                "The first novel in the Harry Potter series and Rowling's debut novel.",
            descriptionVi:
                "Cuốn tiểu thuyết đầu tiên trong loạt truyện Harry Potter và là tiểu thuyết đầu tay của Rowling.",
            price: 350000,
            salePrice: 299000,
            coverImage: "/placeholder/400x400.svg",
            pageCount: 223,
            language: "en",
            stock: 100,
            featured: true,
            categoryId: createdCategories[5].id, // Children & Young Adults
            publisherId: createdPublishers[1].id,
            authorNames: ["J.K. Rowling"],
            images: [
                "https://th.bing.com/th/id/R.42eb62da96b395984b86322d59a9601e?rik=DYmtRnAqw2eMwg&pid=ImgRaw&r=0",
            ],
        },
        {
            title: "Murder on the Orient Express",
            titleVi: "Án Mạng Trên Tàu Tốc Hành Phương Đông",
            isbn: "9780062693662",
            description:
                "A detective novel featuring the Belgian detective Hercule Poirot.",
            descriptionVi:
                "Một tiểu thuyết trinh thám có sự tham gia của thám tử người Bỉ Hercule Poirot.",
            price: 280000,
            coverImage: "/placeholder/400x400.svg",
            pageCount: 256,
            language: "en",
            stock: 75,
            featured: false,
            categoryId: createdCategories[0].id, // Fiction
            publisherId: createdPublishers[1].id,
            authorNames: ["Agatha Christie"],
            images: [
                "https://bloody-disgusting.com/wp-content/uploads/2017/11/Murder-on-the-Orient-Express-Review.jpg",
            ],
        },
        {
            title: "1984",
            titleVi: "1984",
            isbn: "9780452284234",
            description:
                "A dystopian social science fiction novel and cautionary tale.",
            descriptionVi:
                "Một tiểu thuyết khoa học viễn tưởng xã hội phản utopia và câu chuyện cảnh báo.",
            price: 320000,
            salePrice: 280000,
            coverImage: "/placeholder/400x400.svg",
            pageCount: 328,
            language: "en",
            stock: 60,
            featured: true,
            categoryId: createdCategories[0].id, // Fiction
            publisherId: createdPublishers[2].id,
            authorNames: ["George Orwell"],
            images: [
                "https://tse3.mm.bing.net/th/id/OIP.r-Y7Hb5XVAyqxs2bdgDnwgHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
            ],
        },
        {
            title: "The Alchemist",
            titleVi: "Nhà Giả Kim",
            isbn: "9780062315007",
            description:
                "A philosophical novel about a young shepherd's journey to find treasure.",
            descriptionVi:
                "Một tiểu thuyết triết học về cuộc hành trình của một chàng chăn cừu trẻ để tìm kho báu.",
            price: 250000,
            coverImage: "/placeholder/400x400.svg",
            pageCount: 163,
            language: "en",
            stock: 80,
            featured: false,
            categoryId: createdCategories[0].id, // Fiction
            publisherId: createdPublishers[1].id,
            authorNames: ["Paulo Coelho"],
            images: [
                "https://tse1.mm.bing.net/th/id/OIP.Cj8kWrlEFW0Oh3MhWvAeGAHaDt?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
            ],
        },
        {
            title: "Sapiens: A Brief History of Humankind",
            titleVi: "Sapiens: Lược sử loài người",
            isbn: "9780062316097",
            description:
                "An exploration of how Homo sapiens came to dominate the world.",
            descriptionVi:
                "Một cuộc khám phá về cách Homo sapiens thống trị thế giới.",
            price: 380000,
            salePrice: 320000,
            coverImage: "/placeholder/400x400.svg",
            pageCount: 443,
            language: "en",
            stock: 45,
            featured: true,
            categoryId: createdCategories[4].id, // History
            publisherId: createdPublishers[1].id,
            authorNames: ["Yuval Noah Harari"],
            images: [
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
            ],
        },
        {
            title: "The Lean Startup",
            titleVi: "Khởi nghiệp tinh gọn",
            isbn: "9780307887894",
            description:
                "How today's entrepreneurs use continuous innovation to create radically successful businesses.",
            descriptionVi:
                "Cách các doanh nhân ngày nay sử dụng đổi mới liên tục để tạo ra các doanh nghiệp thành công.",
            price: 420000,
            coverImage: "/placeholder/400x400.svg",
            pageCount: 336,
            language: "en",
            stock: 35,
            featured: false,
            categoryId: createdCategories[3].id, // Business & Economics
            publisherId: createdPublishers[2].id,
            authorNames: ["Eric Ries"],
            images: [
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
            ],
        },
        {
            title: "Clean Code",
            titleVi: "Mã nguồn sạch",
            isbn: "9780132350884",
            description: "A handbook of agile software craftsmanship.",
            descriptionVi: "Cẩm nang về nghề thủ công phần mềm linh hoạt.",
            price: 480000,
            salePrice: 400000,
            coverImage: "/placeholder/400x400.svg",
            pageCount: 464,
            language: "en",
            stock: 25,
            featured: true,
            categoryId: createdCategories[2].id, // Science & Technology
            publisherId: createdPublishers[3].id,
            authorNames: ["Robert C. Martin"],
            images: [
                "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400",
            ],
        },
        {
            title: "The Catcher in the Rye",
            titleVi: "Bắt trẻ đồng xanh",
            isbn: "9780316769174",
            description:
                "A controversial novel narrated by a teenager named Holden Caulfield.",
            descriptionVi:
                "Một tiểu thuyết gây tranh cãi được kể bởi một thiếu niên tên Holden Caulfield.",
            price: 290000,
            coverImage: "/placeholder/400x400.svg",
            pageCount: 277,
            language: "en",
            stock: 55,
            featured: false,
            categoryId: createdCategories[0].id, // Fiction
            publisherId: createdPublishers[0].id,
            authorNames: ["J.D. Salinger"],
            images: [
                "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
            ],
        },
        {
            title: "Thinking, Fast and Slow",
            titleVi: "Tư duy nhanh và chậm",
            isbn: "9780374533557",
            description:
                "A groundbreaking tour of the mind and explains the two systems that drive the way we think.",
            descriptionVi:
                "Một cuộc hành trình đột phá của tâm trí và giải thích hai hệ thống điều khiển cách chúng ta suy nghĩ.",
            price: 360000,
            coverImage: "/placeholder/400x400.svg",
            pageCount: 499,
            language: "en",
            stock: 40,
            featured: false,
            categoryId: createdCategories[1].id, // Non-Fiction
            publisherId: createdPublishers[0].id,
            authorNames: ["Daniel Kahneman"],
            images: [
                "https://images.unsplash.com/photo-1472173148041-00294f0814a2?w=400",
            ],
        },
        {
            title: "Where the Crawdads Sing",
            titleVi: "Nơi tôm cua hát",
            isbn: "9780735219090",
            description:
                "A coming-of-age murder mystery set in the marshlands of North Carolina.",
            descriptionVi:
                "Một bí ẩn giết người về tuổi trưởng thành diễn ra ở đầm lầy North Carolina.",
            price: 340000,
            salePrice: 290000,
            coverImage: "/placeholder/400x400.svg",
            pageCount: 370,
            language: "en",
            stock: 65,
            featured: true,
            categoryId: createdCategories[0].id, // Fiction
            publisherId: createdPublishers[0].id,
            authorNames: ["Delia Owens"],
            images: [
                "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
            ],
        },
        {
            title: "The Hobbit",
            titleVi: "Người Hobbit",
            isbn: "9780547928227",
            description:
                "A fantasy novel and children's book by J. R. R. Tolkien.",
            descriptionVi:
                "Một tiểu thuyết giả tưởng và sách thiếu nhi của J. R. R. Tolkien.",
            price: 320000,
            coverImage: "/placeholder/400x400.svg",
            pageCount: 365,
            language: "en",
            stock: 70,
            featured: false,
            categoryId: createdCategories[5].id, // Children & Young Adults
            publisherId: createdPublishers[1].id,
            authorNames: ["J.R.R. Tolkien"],
            images: [
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
            ],
        },
    ];

    for (const bookData of books) {
        const { authorNames, ...bookInfo } = bookData;

        const book = await prisma.book.upsert({
            where: { isbn: bookInfo.isbn },
            update: {},
            create: bookInfo,
        });

        // Create book-author relationships
        for (const authorName of authorNames) {
            const author = createdAuthors.find((a) => a.name === authorName);
            if (author) {
                // Check if relationship already exists
                const existingRelation = await prisma.bookAuthor.findFirst({
                    where: {
                        bookId: book.id,
                        authorId: author.id,
                    },
                });

                if (!existingRelation) {
                    await prisma.bookAuthor.create({
                        data: {
                            bookId: book.id,
                            authorId: author.id,
                        },
                    });
                }
            }
        }

        console.log("Created book:", book.title);
    }

    // Create sample reviews for some books
    const reviews = [
        {
            rating: 5,
            comment:
                "An absolutely gripping horror novel! Stephen King at his finest.",
            bookIsbn: "9780307743657", // The Shining
        },
        {
            rating: 4,
            comment: "A masterpiece that changed my life. Highly recommended!",
            bookIsbn: "9780062315007", // The Alchemist
        },
        {
            rating: 5,
            comment: "Fascinating insights into human history and behavior.",
            bookIsbn: "9780062316097", // Sapiens
        },
        {
            rating: 5,
            comment: "Essential reading for any software developer.",
            bookIsbn: "9780132350884", // Clean Code
        },
        {
            rating: 4,
            comment: "A magical start to an incredible series.",
            bookIsbn: "9780747532699", // Harry Potter
        },
    ];

    for (const reviewData of reviews) {
        const book = await prisma.book.findUnique({
            where: { isbn: reviewData.bookIsbn },
        });

        if (book) {
            const existingReview = await prisma.review.findFirst({
                where: {
                    bookId: book.id,
                    userId: adminUser.id,
                },
            });

            if (!existingReview) {
                await prisma.review.create({
                    data: {
                        rating: reviewData.rating,
                        comment: reviewData.comment,
                        bookId: book.id,
                        userId: adminUser.id,
                    },
                });
                console.log(`Created review for: ${book.title}`);
            }
        }
    }

    console.log("Seeding finished.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
