
// async function createTemplate(workflowGroupsData, Subject, emailID, Content, topicID){
//     let template = await novu.notificationTemplates.create({
//         // name: Subject,
        
//         name: topicID,
//         active: true,
//         // taking first workflow group id
//         notificationGroupId: workflowGroupsData.data[0]._id,

//         // triggers: [
//         //     {
//         //         identifier: 'smash-Bkw44q_1L',
//         //         type: 'event',
//         //         variables: [
//         //             { name: 'subject', type: 'string' },
//         //             // { name: 'body', type: 'string' },
//         //             { name: 'content', type: 'string' },
//         //         ],
//         //     },
//         // ],

//         steps: [
//           // Adding one chat step
//           {
//             shouldStopOnFail: false,
//             name: Subject,
//             filters: [
//                 {
//                   value: 'AND',
//                   children: [
//                     {
//                       field: 'content',
//                       value: 'flag',
//                       operator: 'NOT_IN',
//                       // 'payload'
//                       on: FilterPartTypeEnum.PAYLOAD,
//                     },
//                   ],
//                 },
//               ],
           
//             template: {
//               type: StepTypeEnum.EMAIL,
//             //   active: true,
//               subject: Subject,
//               variables: [
//                 {
//                   name: 'content',
//                   // 'String'
//                   type: TemplateVariableTypeEnum.STRING,
//                   required: true,
//                 },
//               ],
//               body: 'content',
//                 to: '{{emailID}}', 
//               content: '<p>This is a hardcoded test body with dynamic content: {{content}}</p>',
//               contentType: 'editor',
//             },
//           },
//         ],
//         description: 'Onboarding workflow to trigger after user sign up',
//         active: true,
//         draft: false,
//         critical: false,

//     })  
//       console.log(typeof(Content));
      

//     return template;
// }