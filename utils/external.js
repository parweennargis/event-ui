const request = require('request');
const config = require('../config');

const hitApi = async ({url=`${config.apiUrl}`, path="", method='GET', headers={}, body, formData, qs}) => {
    return new Promise((resolve, reject) => {
        const options = {
            url: `${url}${path}`,
            method,
            headers
        };
    
        if (body) {
            options.body = JSON.stringify(body);
        }
    
        if (formData) options.formData = formData;

        if (qs) options.qs = qs;

        request(options, function(err, response) {
            if (err) {
                console.log(err);
                // throw new Error(err.message);
                reject(err);
            }
            console.log(response.statusCode);
            // console.log(JSON.parse(response.body));
            try {
                if (response.statusCode === 200) resolve(JSON.parse(response.body));
                reject(JSON.parse(response.body));
            } catch (error) {
                console.log(error);
                resolve(response.body);
            }
        });
    });
};

module.exports = {
    hitApi
};