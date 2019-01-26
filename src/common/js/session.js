import Storage from './storage.js';
class Session {
    constructor () {
        
    }
    isLogin () {
        return Storage.get('user');
    }
}

export default new Session();