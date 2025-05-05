const UserDAO = require('../daos/userDao');
const { generateHash, verify } = require('../utils/bcryptUtils');
const CustomError = require('../utils/customError');

class UserService {
    constructor() {
        this.userDao = new UserDAO();
    }

    async registerUser(username, password, email) {
        try {
            const hashedPassword = await generateHash(password);
            return await this.userDao.createUser(username, hashedPassword,email);
        } catch (error) {
            throw error;
        }
    }

    async loginUser(username, password) {
        try {
            const result = await this.userDao.getUserByUsername(username);
            if (!result.success || !result.data) {
                throw new Error('Invalid username or password');
            }

            const isValid = await verify(password, result.data.password);
            if (!isValid) {
                throw new Error('Invalid username or password');
            }

            return result.data;
        } catch (error) {
            throw error;
        }
    }

    async createUser(username, password, email) {
        try {
            const hashedPassword = await generateHash(password);
            return await this.userDao.createUser(username, hashedPassword, email);
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id) {
        try {
            return await this.userDao.getUserById(id);
        } catch (error) {
            throw error;
        }
    }

    async getUserByUsername(username) {
        try {
            return await this.userDao.getUserByUsername(username);
        } catch (error) {
            throw error;
        }
    }

    async getAllUsers() {
        try {
            return await this.userDao.getAllUsers();
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id, username, email) {
        try {
            return await this.userDao.updateUser(id, username, email);
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            return await this.userDao.deleteUser(id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserService;