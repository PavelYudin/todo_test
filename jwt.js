const jwt = require('jsonwebtoken');

/**
 * Секретное слово для формирования токена
 * @type {String}
 */
const secret = process.env.secret;


/**
 * Получение токена
 * @param {String} id - идентификатор пользователя
 * @returns token пользователя
 */
exports.getToken = (id) => {
    return jwt.sign({ data: id },secret, { expiresIn: 3000 });
}


/**
 * Проверяет подлинность токена
 * @param {String} token - access token
 * @returns {Boolean} 
 */
exports.verification = (token) => {
    try{
        jwt.verify(token, secret);
        return true; 
    }catch(err){
        return false;
    }
}


/**
 * Получает id пользователя из токена и возвращает его 
 * @param {String} token - assecc token
 * @returns {String} id пользователя
 */
exports.getIdUserFromToken = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload).data;
};