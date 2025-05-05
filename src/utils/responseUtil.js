function createResponse(success, data = null, message = '') {
    return {
        success,
        data,
        message
    };
}

module.exports = {
    createResponse
};