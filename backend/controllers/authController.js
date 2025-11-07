const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Đăng ký tài khoản mới
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: "Vui lòng điền đầy đủ thông tin" 
            });
        }

        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: "Email đã tồn tại" 
            });
        }

        // Mã hóa mật khẩu
        console.log('Password before hashing:', password);
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword);

        // Tạo user mới
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user"
        });
        
        console.log('Created user:', {
            id: user._id,
            hasPassword: !!user.password,
            passwordLength: user.password?.length
        });

        // Verify the user was created with password
        const savedUser = await User.findById(user._id).select('+password');
        if (!savedUser || !savedUser.password) {
            throw new Error('Lỗi khi lưu mật khẩu');
        }

        res.status(201).json({
            success: true,
            message: "Đăng ký thành công",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi đăng ký",
            error: error.message
        });
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập email và mật khẩu"
            });
        }

        // Tìm user theo email và lấy tất cả các trường
        const user = await User.findOne({ email }).select('+password');
        
        console.log('Login attempt - User data:', {
            id: user?._id,
            email: user?.email,
            hasPassword: !!user?.password,
            passwordField: user?.password,
            allFields: user ? Object.keys(user.toObject()) : []
        });

        // Kiểm tra user tồn tại
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email không tồn tại"
            });
        }

        // Kiểm tra mật khẩu
        if (!user.password) {
            console.error('No password stored for user');
            return res.status(401).json({
                success: false,
                message: "Tài khoản chưa được thiết lập mật khẩu"
            });
        }

        console.log('Password comparison:', {
            inputPasswordLength: password?.length,
            storedPasswordLength: user.password?.length,
            storedPasswordType: typeof user.password
        });

        // Kiểm tra JWT_SECRET
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined');
            return res.status(500).json({
                success: false,
                message: "Lỗi cấu hình server"
            });
        }

        // So sánh password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password validation result:', isPasswordValid);
    
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Mật khẩu không đúng"
            });
        }

        // Tạo JWT token
            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

        // Trả về thông tin đăng nhập thành công
        res.json({
            success: true,
            message: "Đăng nhập thành công",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi đăng nhập",
            error: error.message
        });
    }
};

// Đăng xuất
exports.logout = (req, res) => {
    res.json({
        success: true,
        message: "Đăng xuất thành công"
    });
};