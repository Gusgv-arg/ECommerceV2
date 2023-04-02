import bcrypt from 'bcryptjs'

const data = {
    users: [
        {
          name: 'Gustavo',
          email: 'admin@gmail.com',
          password: bcrypt.hashSync('123'),
          isAdmin: true,
        },
        {
          name: 'Customer',
          email: 'customerr@gmail.com',
          password: bcrypt.hashSync('123'),
          isAdmin: false,
        },
      ],
    products: [
        {
            name: "Mate gourd with Alpaca finish",
            slug: "Mate gourd with Alpaca finish",
            price: 60,
            description: "Gourd mate hand wrapped and sewed in cow leather with alpaca finish around the opening.",
            image: "https://login.eltero.net/modules/products/uploads/product_1.jpeg",
            stock: 500,
            isDeleted: false,
            comments: [],
            category: "Mates",
            rating: 5,
            brand: "El Tero",
            numReviews: 10
        },
        {
            name: "Mate gourd with alpaca colonial design.",
            slug: "Mate gourd with alpaca colonial design.",
            price: 65,
            description: "Gourd mate hand wrapped and sewed in cow leather. The alpaca finish around the opening has a chiseled Real design.",
            image: "https://login.eltero.net/modules/products/uploads/product_2.jpeg",
            stock: 0,
            isDeleted: false,
            comments: [],
            category: "Mates",
            rating: 4,
            brand: "El Tero",
            numReviews: 10
        },
        {
            name: "Mate with alpaca finish real",
            slug: "Mate with alpaca finish real",
            price: 65,
            description: "Gourd mate hand wrapped and sewed in cow leather.",
            image: "https://login.eltero.net/modules/products/uploads/product_3.jpeg",
            stock: 500,
            isDeleted: false,
            comments: [],
            category: "Mates",
            rating: 3.5,
            brand: "El Tero",
            numReviews: 10
        },
        {
            name: "Mate with alpaca finish Colonial",
            slug: "Mate with alpaca finish Colonial",
            price: 55,
            description: "Gourd mate with Alpaca opening with chiseled Colonial design.",
            image: "https://login.eltero.net/modules/products/uploads/product_5.jpeg",
            stock: 500,
            isDeleted: false,
            comments: [],
            category: "Mates",
            rating: 4.5,
            brand: "El Tero",
            numReviews: 10
        },
        {
            name: "Mate with alpaca finish",
            slug: "Mate with alpaca finish",
            price: 50,
            description: "Gourd mate with alpaca finish around the opening. The mate comes with a stand base of cow leather.",
            image: "https://login.eltero.net/modules/products/uploads/product_6.jpeg",
            stock: 500,
            isDeleted: false,
            comments: [],
            category: "Mates",
            rating: 5,
            brand: "El Tero",
            numReviews: 10
        }
    ]
}

export default data