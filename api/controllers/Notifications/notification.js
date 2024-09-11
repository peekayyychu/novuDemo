const { Novu } =  require('@novu/node');
const novu = new Novu('f67f91f0ce1f2ce1295b9c23fa9c7373');
const novuServices = require('../../Services/novuService');

module.exports = {
    friendlyName: 'subscribe',
    description : '',
    example: [
        `curl -X GET "http://localhost:1337/`,
    ],
    serverError: {
        responseType: 'serverError',
        description: 'server issue',
    },


    fn: async function() {
        const subject = 'Test function';
        let content = 'There has been a problem';
        // let content = new Object();
        // content.data = 'There has been a problem'
        const topicID = 'alerttest1232';
        await novuServices.createSubscribers('66', 'Pratyush', 'Kumar', 'pratyush.kumar@smartjoules.in');
        const info = await novuServices.initiateSubscribers('66', topicID);

        await novuServices.createSubscribers('99','Smart', 'Joules', 'pratyushkumar.jans@gmail.com');
        const senderInfo = await novuServices.initiateSubscribers('99',topicID);
        let record = null;
        if(info && senderInfo){
            let subscriberIDs = ['66','99'];
            record = await novuServices.sender(subject, content, subscriberIDs, topicID);
        }else{
            console.log('Problem problem');
        }
        return record;
    }
};


