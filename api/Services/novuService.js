const { workflow } = require('@novu/framework');
const { Novu, FilterPartTypeEnum, TemplateVariableTypeEnum, StepTypeEnum, TriggerRecipientsTypeEnum, ChannelTypeEnum} =  require('@novu/node');
const apiKey = process.env.NOVU_SECRET_KEY;
const axios = require('axios');
const novu = new Novu(apiKey);


const data = `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sample Webpage</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0;
                    margin: 0;
                    padding: 20px;
                }
                h1 {
                    color: #333;
                }
                p {
                    color: #666;
                }
            </style>
        </head>
        <body>
            <h1>Welcome to {{Subject}}</h1>
            <p>This is a {{Content}}.</p>
        </body>
        </html>
    `;


async function registerSubscribers(subscriberDetails){
    await novu.subscribers.identify(subscriberDetails.subscriberID,{
        firstName: subscriberDetails.firstName,
        lastName: subscriberDetails.lastName,
        email: subscriberDetails.emailID,
        avatar: 'https://gravatar.com/avatar/553b157d82ac2880237566d5a644e5fe?s=400&d=robohash&r=x',
        locale: 'en-US',
        data: {
            isdeveloper: subscriberDetails.isdeveloper,
            customKey: 'customValue',
        },
    });
}

async function createWorkflow(){
    await novu.workflowOverrides.create({
        workflowId: 'workflow_id_123',
        tenantId: 'tenant_id_abc',
        active: false,
        preferenceSettings: {
          email: true,
          sms: true,
          in_app: true,
          chat: true,
          push: true,
        },
      });
}

async function fetchWorkFlow(){
    try {
    const {data: workflowGroupsData} = await novu.notificationGroups.get();
    if(!workflowGroupsData || workflowGroupsData.length ===0) {
        throw new Error('No workflow groups found');
    }
    return workflowGroupsData;
} catch (error) {
    console.log(error);
}
}

async function createTopic(topicID, Name){
    let existingTopic = await novu.topics.get(topicID);
    if(existingTopic){
        console.log('Topic exists', existingTopic);
        // existingTopic = null;
    }else{
        await novu.topics.create({
            key: topicID,
            name: Name,
        })
        console.log('Topic created successfully');
    }
}

async function addSubscriberToWorkflow(subscriberIDs, topicID){
    // await createTopic(topicID, Name);

    let response = await novu.topics.addSubscribers(topicID,{
        subscribers: subscriberIDs,
    });

    if(!response){
        console.log('Failed to register subscribers to this particular topic');
    }else{
        console.log('Success in registering subscribers to this particular topic');
    }
}

async function createWorkflowWithEmailTemplate(Name, workflowGroupsData){
    
    let template = await novu.notificationTemplates.create({
        name: Name,
        active: true,
        notificationGroupId: workflowGroupsData.data[0]._id,

        steps: [
            {
                shouldStopOnFail: false,
                name: '{{Subject}}',
                senderName: 'SJPL',
                template: {
                    type: StepTypeEnum.EMAIL,
                    subject: '{{Subject}}',
                    content: [
                        {
                            type: 'text',
                            content: data,
                        }
                    ],
                },
            },
        ],
        description: 'Onboarding workflow to trigger after user sign up',
        active: true,
        draft: false,
        critical: false,
        type: 'customHtml',
    });

    if(!template){
        console.log.error('Error in creating workflow');
    }else{
        console.log('Workflow successfully created');
    }
}

async function createMessagingTemplate(Subject, workflowGroupsData, Name){
    try{
        const template = await novu.notificationTemplates.create({
            name: 'Onboarding Workflow',
            active: true,
            notificationGroupId: workflowGroupsData.data[0]._id, // Attach to an existing notification group
            steps: [
              {
                // This step represents sending an SMS
                shouldStopOnFail: false,
                name: 'Send SMS to User',
                senderName: 'SJPL',
                template: {
                  type: StepTypeEnum.SMS,
                  active: true,
                  variables: [
                    {
                      name: "chatContent",
                      // 'String'
                      type: TemplateVariableTypeEnum.STRING,
                      required: true,
                      defaultValue: "default message",
                    },
                ],
                  content : '{{content}}',
                },
              },
            ],
            description: 'Onboarding workflow to trigger after user sign-up via SMS',
            draft: false,
            critical: false,
            type: 'Editor',
          });

        if(!template){
            console.log.error('Error in creating workflow');
        }else{
            console.log('Workflow successfully created');
        }

    }catch(e){
        console.log(e);
    }
    
}

async function triggerWorkflowToTopic(topicID, workflowID, Subject, Content) {
    try{
        await novu.trigger(workflowID,{
            to:{
                type: 'Topic',
                topicKey: topicID,
            },
            payload:{
                //enter variables to the template
                // Subject: Subject,
                content: Content,
            }
        })
    }catch(error){
        console.log(error);
    }
}

async function createEmailTemplate(){
    let workflowGroupsData = await fetchWorkFlow();
    await createWorkflowWithEmailTemplate('Test', workflowGroupsData);
}

async function sendEmail(topicID, subscriberIDs, Subject, Content, workflowID, Name){
    let workflowGroupsData = await fetchWorkFlow();
    await addSubscriberToWorkflow(subscriberIDs, topicID);
    await createTopic(topicID, Name);
    await createWorkflowWithEmailTemplate(Name, workflowGroupsData);
    await triggerWorkflowToTopic(topicID, workflowID, Subject, Content);
}

async function sendSMS(topicID, subscriberIDs, Subject, Content, workflowID, Name){
    let workflowGroupsData = await fetchWorkFlow();
    await addSubscriberToWorkflow(subscriberIDs, topicID);
    await createTopic(topicID, Name);
    await createMessagingTemplate(Subject, workflowGroupsData, Name);
    await triggerWorkflowToTopic(topicID, workflowID, Subject, Content);
}


module.exports = {
    triggerWorkflowToTopic,
    createWorkflowWithEmailTemplate,
    addSubscriberToWorkflow,
    registerSubscribers,
    sendEmail,
    sendSMS,
    createEmailTemplate,
}

//make a new template
//hardcode subscriber id
//trigger the event
//find the difference between workflow and template
