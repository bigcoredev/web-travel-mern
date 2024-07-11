import bcrypt from "bcryptjs";

const users = [
    {
        name: 'Admin Doe',
        firstname: "Admin",
        lastname: "Doe",
        email: 'superadmin@gmail.com',
        phone: '(436) 486-3538 x29071',
        password: bcrypt.hashSync('123456', 10),
        pic: "/uploads/image-1716600590193.jpg",
        isAdmin: true,
    },
    {
        name: 'John Doe',
        firstname: "John",
        lastname: "Doe",
        email: 'john@gmail.com',
        phone: '(436) 486-3538 x29071',
        password: bcrypt.hashSync('123456', 10),
        pic: "/images/avatar.png",
        isAdmin: false,
    },
    {
        name: 'Jany Doe',
        firstname: "Jany",
        lastname: "Doe",
        email: 'jany@gmail.com',
        phone: '(436) 486-3538 x29071',
        password: bcrypt.hashSync('123456', 10),
        pic: "/images/avatar.png",
        isAdmin: false,
    },
];

export default users;