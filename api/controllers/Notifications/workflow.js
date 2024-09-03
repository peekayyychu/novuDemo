// const { Novu,
//     TemplateVariableTypeEnum,
//     FilterPartTypeEnum,
//     StepTypeEnum
// } = require('@novu/node');
// const novu = new Novu('f67f91f0ce1f2ce1295b9c23fa9c7373');



// async function bootstrap() {

//     await novu.subscribers.identify('pratyush.kumar@smartjoules.in', {
//         firstName: 'Pratyush',
//         lastName: 'Kumar',
//         email: 'pratyush.kumar@smartjoules.in',
//         // phone: '+918860279717',
//         avatar:
//             'https://gravatar.com/avatar/553b157d82ac2880237566d5a644e5fe?s=400&d=robohash&r=x',
//         locale: 'en-US',
//         data: {
//             isDeveloper: true,
//             customKey: 'customValue',
//         },
//     });


//     const { data: workflowGroupsData } = await novu.notificationGroups.get();
//     const topicId = 'flexID:666';
//     const response = await novu.topics.create({
//         key: topicId,  // Unique key for the topic
//         name: 'Unable to turn on chiller',
//     });

//     const topicSubscribed = await novu.topics.addSubscribers(topicId, {
//         subscribers: ['praveenkumar@smartjoules.in'],  // Replace with actual subscriber IDs
//     });
//     // return topicSubscribed;


//     try {
//         //working workflow code


//         const response = await novu.notificationTemplates.create({
//             name: 'flexID:666',
//             description: 'Workflow to handle the recipe alert for mgch and rid',
//             notificationGroupId: workflowGroupsData.data[0]._id,
//             active: true,
//             triggers: [
//                 {
//                     identifier: 'praveen_test_new',
//                     type: 'event',
//                     variables: [
//                         { name: 'subject', type: 'string' },
//                         { name: 'body', type: 'string' },
//                         { name: 'content', type: 'string' },
//                     ],
//                 },
//             ],
//             steps: [
//                 {
//                     template: {
//                         type: 'email',  // Specify the email delivery step
//                         name: 'Send News Update Email',
//                         template: {
//                             subject: 'Breaking News: {{headline}}',
//                             body: '{{content}}',
//                             to: '{{subscriber.email}}',  // Email of the subscriber
//                         },
//                     },
//                 }
//             ],
//         });

        

//         const _response = await novu.trigger('siteidmgchrecipeid12345-MugwYUgRg', {
//             to: {
//                 type: 'Topic',
//                 topicKey: topicId,
//             },
//             payload: {
//                 subject: 'Important Update!',
//                 content: 'This is an important news update you should be aware of.',
//                 // name:'praveen'
//             },
//         });

//         console.log('Event triggered for topic:', _response);
//         console.log('Workflow created:', response);
//     } catch (error) {
//         console.error('Error creating workflow:', error);
//     }









//     // const workflow = await novu.notificationTemplates.create({
//     //     name: 'Onboarding Workflow',
//     //     // taking first workflow group id
//     //     notificationGroupId: workflowGroupsData.data[0]._id,
//     //     steps: [
//     //         // Adding one chat step
//     //         {
//     //             active: true,
//     //             shouldStopOnFail: false,
//     //             // UUID is optional.
//     //             uuid: '78ab8c72-46de-49e4-8464-257085960f9e',
//     //             name: 'Chat',
//     //             filters: [
//     //                 {
//     //                     value: 'AND',
//     //                     children: [
//     //                         {
//     //                             field: '{{chatContent}}',
//     //                             value: 'flag',
//     //                             operator: 'NOT_IN',
//     //                             // 'payload'
//     //                             on: FilterPartTypeEnum.PAYLOAD,
//     //                         },
//     //                     ],
//     //                 },
//     //             ],
//     //             template: {
//     //                 // 'chat'
//     //                 type: StepTypeEnum.CHAT,
//     //                 active: true,
//     //                 subject: '',
//     //                 variables: [
//     //                     {
//     //                         name: 'chatContent',
//     //                         // 'String'
//     //                         type: TemplateVariableTypeEnum.STRING,
//     //                         required: true,
//     //                     },
//     //                 ],
//     //                 content: '{{chatContent}}',
//     //                 contentType: 'editor',
//     //             },
//     //         },
//     //     ],
//     //     description: 'Onboarding workflow to trigger after user sign up',
//     //     active: true,
//     //     draft: false,
//     //     critical: false,
//     // });
//     // return workflow;

// }

// module.exports = {
//     friendlyName: 'subscribe',
//     description : '',
//     example: [
//         `curl -X GET "http://localhost:1337/`,
//     ],

//     fn: async function () {
//         bootstrap();
//     }
// }