const axios = require('axios');
const md5 = require('md5');


class DataCRMClient {
    constructor() {
        this.baseUrl = 'https://develop1.datacrm.la/jdimate/pruebatecnica/webservice.php';
        this.secretKey = '2IPfpYL3SxRRjLWx';
        this.username = 'prueba';
    }

    /**
     * Paso 1: Obtener el token
     */
    async getChallenge() {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    operation: 'getchallenge',
                    username: this.username
                }
            });

            if (response.data.success) {
                return response.data.result.token;
            } else {
                throw new Error(response.data.error?.message || 'Error al obtener challenge token');
            }
        } catch (error) {
            console.error('Model [getChallenge]:', error.message);
            throw error;
        }
    }

    /**
     * Paso 2: Autenticarse para obtener el sessionName
     */
    async login(token) {
        try {
            // Generación de la accessKey según documentación: MD5(token + secretKey)
            const accessKey = md5(token + this.secretKey);

            // Preparación de datos para POST x-www-form-urlencoded
            const params = new URLSearchParams();
            params.append('operation', 'login');
            params.append('username', this.username);
            params.append('accessKey', accessKey);

            const response = await axios.post(this.baseUrl, params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (response.data.success) {
                return response.data.result.sessionName;
            } else {
                throw new Error(response.data.error?.message || 'Error en autenticación');
            }
        } catch (error) {
            console.error('Model [login]:', error.message);
            throw error;
        }
    }

    /**
     * Paso 3: Consultar los contactos
     */
    async fetchContacts(sessionName) {
        try {
            const query = 'select * from Contacts;';
            const response = await axios.get(this.baseUrl, {
                params: {
                    operation: 'query',
                    sessionName: sessionName,
                    query: query
                }
            });

            if (response.data.success) {
                return response.data.result;
            } else {
                throw new Error(response.data.error?.message || 'Error en la consulta');
            }
        } catch (error) {
            console.error('Model [fetchContacts]:', error.message);
            throw error;
        }
    }

    /**
     * Método principal que ejecuta el flujo completo.
     */
    async getContactsFlow() {
        try {
            const token = await this.getChallenge();
            const sessionName = await this.login(token);
            const contacts = await this.fetchContacts(sessionName);


            return contacts.map(c => ({
                id: c.id,
                contact_no: c.contact_no,
                lastname: c.lastname,
                createdtime: c.createdtime
            }));
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new DataCRMClient();
