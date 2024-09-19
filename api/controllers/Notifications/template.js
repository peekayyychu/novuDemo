const { Novu } =  require('@novu/node');
const novuServices = require('../../Services/novuService');

module.exports = {
    friendlyName: 'templates',
    description : '',
    example: [
        `curl -X GET "http://localhost:1337/`,
    ],
    exits: {
      serverError: {
        responseType: 'serverError',
        description: 'server issue',
      },
      success: {
        responseType: 'ok',
        description: 'Mail created successfully',
      },
    },


    fn: async function(inputs ,exits) {
      try {
        await novuServices.createEmailTemplate();
        return exits.success({
            message: 'Mail created successfully',
        });
      } catch(e) {
        return exits.serverError({
          err: 'Server has encountered an error.Please contact the administrator ' + e,
        })
      }

    }
};