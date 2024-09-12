const { workflow } = require('@novu/framework');
const { Novu, FilterPartTypeEnum, TemplateVariableTypeEnum, StepTypeEnum, TriggerRecipientsTypeEnum} =  require('@novu/node');
const apiKey = 'f67f91f0ce1f2ce1295b9c23fa9c7373';
const axios = require('axios');
const novu = new Novu(apiKey);


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

async function createWorkflowWithEmailTemplate(Subject, Content, Name, workflowGroupsData){
    
    let template = await novu.notificationTemplates.create({
        name: Name,
        active: true,
        notificationGroupId: workflowGroupsData.data[0]._id,

        steps: [
            {
                shouldStopOnFail: false,
                name: Subject,
                template: {
                    type: StepTypeEnum.EMAIL,
                    subject: Subject,
                    content: [
                        {
                            type: 'text',
                            content: Content,
                        }
                    ],
                },
            },
        ],
        description: 'Onboarding workflow to trigger after user sign up',
        active: true,
        draft: false,
        critical: false,
        type: 'Editor',
    });

    if(!template){
        console.log.error('Error in creating workflow');
    }else{
        console.log('Workflow successfully created');
    }
}

async function triggerWorkflowToTopic(topicID, workflowID) {
    try{
        await novu.trigger(workflowID,{
            to:{
                type: 'Topic',
                topicKey: topicID,
            },
            payload:{
                //enter variables to the template
            }
        })
    }catch(error){
        console.log(error);
    }
}

async function sendEmail(topicID, subscriberIDs, Subject, Content, workflowID, Name){
    let workflowGroupsData = await fetchWorkFlow();
    await addSubscriberToWorkflow(subscriberIDs, topicID);
    await createTopic(topicID, Name);
    await createWorkflowWithEmailTemplate(Subject, Content, Name, workflowGroupsData);
    await triggerWorkflowToTopic(topicID, workflowID);
}

module.exports = {
    triggerWorkflowToTopic,
    createWorkflowWithEmailTemplate,
    addSubscriberToWorkflow,
    registerSubscribers,
    sendEmail,
}

//make a new template
//hardcode subscriber id
//trigger the event
//find the difference between workflow and template
