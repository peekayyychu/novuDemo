const { Novu } =  require('@novu/node');
const novu = new Novu('<API_KEY>');
const novuServices = require('../../Services/novuService');

module.exports = {
    friendlyName: 'subscribe',
    description : '',
    example: [
        `curl -X GET "http://localhost:1337/`,
    ],
    inputs: {
      userSubscriberIds: {
        type: ['string'],
        required: true,
        example: ['66','25']
      },
      topicName: {
        type: 'string',
        required: true,
      },
      topicId: {
        type: 'string',
        required: true,
      },
      workflowId: {
        type: 'string',
        required: true,
      },

    },
    exits: {
      serverError: {
        responseType: 'serverError',
        description: 'server issue',
      },
      success: {
        responseType: 'Success',
        description: 'Mail created successfully',
      },
    },


    fn: async function(inputs, exits) {
      try {
        const {userSubscriberIds, topicName, topicId, workflowId} = inputs;

        // let userSubscriberIds = ['66','25'];
        // let topicName = 'Test Topic';
        // let topicId = 'topic1234';
        // let workflowId = 'test-topic';

        // const subscriberDetails = {
        //     subscriberID:'25', 
        //     firstname:'Naman', 
        //     lastname:'Kumar', 
        //     emailID:'namankumar@smartjoules.in',  
        //     isDeveloper:true,
        // }

        // novu.subscribers.update('subscriberID',{
        //   phone: '+91XXXXXXXXXX', //format for phone no.
        // })

        let Subject = 'Smart Alerts';
        let Content = 'This is a test email.';

        // await novuServices.registerSubscribers(subscriberDetails);
        // Register subscribers:- registerSubscribers();
        // Create workflow with template :- createWorkflowWithEmailTemplate()
        // Create topic :- createTopic()
        // Add subscriber to workflow:- addSubscriberToWorkflow()
        // Trigger workflow:- triggerWorkflowToTopic()
        // await novuServices.sendEmail(topicId, userSubscriberIds, Subject, Content, workflowId, topicName);
        await novuServices.sendSMS(topicId, userSubscriberIds, Subject, Content, workflowId, topicName);
      } catch(e) {
        return exits.serverError({
          err: 'Server has encountered an error.Please contact the administrator ' + e,
        })
      }
      return 'Successfull';
    }
};