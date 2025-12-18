const contactModel = require('../models/DataCRMClient');


class ContactController {

    async getContacts(req, res) {
        try {
            const contacts = await contactModel.getContactsFlow();
            res.json({
                success: true,
                data: contacts
            });
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({
                success: false,
                message: 'Ocurrió un error al obtener los contactos.',
                error: error.message
            });
        }
    }
}

module.exports = new ContactController();
