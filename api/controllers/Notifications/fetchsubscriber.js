// const {novuService} = require('../../Services/novuService');

const { getSubscriberDetails } = require("../../Services/novuService");

module.exports = {
    friendlyName: 'fetchSubscribers',
    description : 'Fetch subscriber details from an API',

    example: [
        `curl -X GET "http://localhost:1337/`,
    ],

    inputs: {
        id : {
            type: 'number',
            required: true,
        },

        alert_id: {
            type: 'string',
            required: false,
        },

        alert_name: {
            type: 'string',
            required: true,
        },

        firstname: {
            type: 'string',
            required: true,
        },

        lastname: {
            type: 'string',
            required: false,
        },

        emailID: {
            type: 'string',
            required: true,
        },

        phone: {
            type: 'string',
            required: true,
        },

        site_id: {
            type: 'string',
            required: true,
        },

        status: {
            type: 'number',
            defaultsTo: 1,
        }

    },

    exits: {
        serverError: {
            responseType: 'serverError',
            description: 'server issue',
        },

        success: {
            responseType: 'ok',
            description: 'Subscriber details fetched successfully',
        }
    },

    fn: async function (inputs, exits) {
        try{
            const subscribers = getSubscriberDetails(inputs);

            return exits.success({
                message: 'Successfully reached subscribers',
                data: (await subscribers).emailID  
            });
        }catch(error){
            return exits.serverError({
                message: 'Failed to fetch subscriber details',
                error: error.message
            })
        }
    }
}