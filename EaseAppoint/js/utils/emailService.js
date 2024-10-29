// Email service configuration and functions
const emailService = {
    init() {
        emailjs.init("V9G2uJwD3DM0lMRVQ");
    },
    
    async sendEmail(templateParams) {
        return await emailjs.send(
            'service_xoc0o6b',
            'template_5t01bxn',
            templateParams
        );
    }
};

export default emailService;
