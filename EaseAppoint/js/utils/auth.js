// Authentication related functions
const auth = {
    checkLogin() {
        return localStorage.getItem('isLoggedIn') === 'true';
    },
    
    redirectIfNotLoggedIn() {
        if (!this.checkLogin()) {
            window.location.href = '/index.html';
        }
    },
    
    logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    }
};

export default auth;
