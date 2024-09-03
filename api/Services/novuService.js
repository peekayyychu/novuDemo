const { Novu, FilterPartTypeEnum, TemplateVariableTypeEnum, StepTypeEnum, } =  require('@novu/node');
const apiKey = 'f67f91f0ce1f2ce1295b9c23fa9c7373'
const axios = require('axios');
// const { description } = require('../controllers/Notifications/workflow');
const novu = new Novu(apiKey);

const ovu = axios.create({
    baseURL: 'https://api.novu.co',
    timeout: 10000, // Set timeout to 10 seconds
});

async function createSubscribers(subscriberId,firstName, lastName, emailID){
    await novu.subscribers.identify(subscriberId,{
        firstName: firstName,
        lastName: lastName,
        email: emailID,
        avatar: 'https://gravatar.com/avatar/553b157d82ac2880237566d5a644e5fe?s=400&d=robohash&r=x',
        locale: 'en-US',
        data: {
            isdeveloper: true,
            customKey: 'customValue',
        },
    });
}

async function initiateSubscribers(subscriberId, topicId){
    const info = await novu.topics.addSubscribers(topicId, {
        subscribers: [subscriberId],
    });
    return info;
}

async function fetchWorkFlow(){
    const {data: workflowGroupsData} = await novu.notificationGroups.get();
    if(!workflowGroupsData || workflowGroupsData.length ===0) {
        throw new Error('No workflow groups found');
    }
    return workflowGroupsData;
}

async function createTopic(topicID){
    let existingTopic = await novu.topics.get(topicID);
    if(existingTopic){
        console.log('Topic exists', existingTopic);
        // existingTopic = null;
    }else{
        await novu.topics.create({
            key: topicID,
            name: 'Smash',
        })
        console.log('Topic created successfully');
    }
}

async function subscribeTopic(topicID, subscriberID){
    const topicSubscribed = await novu.topics.addSubscribers(topicID, {
        subscribers: [subscriberID],
    })

    if(!topicSubscribed){
        console.log('Topic subscribption: Unsuccessful');
    }

    return topicSubscribed;
}



async function createTemplate(workflowGroupsData, Subject, emailID, Content, topicID) {
    let template = await novu.notificationTemplates.create({
        name: topicID,
        active: true,
        notificationGroupId: workflowGroupsData.data[0]._id,

        triggers: [
            {
                identifier: 'smash-Bkw44q_1L',
                type: 'event',
                variables: [
                    { name: 'subject', type: 'string' },
                    { name: 'content', type: 'string' },
                ],
            },
        ],

        steps: [
            {
                shouldStopOnFail: false,
                name: Subject,
                template: {
                    type: StepTypeEnum.EMAIL,
                    subject: Subject,
                    content: '<h1>Layout Start</h1>{{{content}}}<h1>Layout End</h1>',
                    to: '{{emailID}}',
                },
            },
        ],
        description: 'Onboarding workflow to trigger after user sign up',
        active: true,
        draft: false,
        critical: false,
        type: 'Editor',
    });

    return template;
}

async function sender(Subject, Content, SubscriberID,AlertType,emailID, topicID){

    try{


        const workflowGroupsData = await fetchWorkFlow();
        
        await createTopic(topicID, Subject);

        const topicSubscribed = await subscribeTopic(topicID, SubscriberID);

        const Template = await createTemplate(workflowGroupsData, Subject, emailID, Content, topicID);

        console.log('Template data:', Template);

        // const payload = {
        //     content: "<h1>Layout Start</h1>{{{body}}}<h1>Layout End</h1>",
        //     description: "Organisation's first layout",
        //     name: "First Layout",
        //     identifier: "firstlayout",
        //     variables: [
        //     {
        //     type: "String",
        //     name: "body",
        //     required: true,
        //     defValue: "",
        //     }
        //     ],
        //     isDefault: "false"
        //     }

        //     await novu.layouts.create(payload);

        // let payloadContent = JSON.parse(Content);

        const _response = await novu.trigger('smash-Bkw44q_1L', {
            to: {
            //   subscriberId: SubscriberID,
            //   email: emailID,
                type: 'Topic',
                topicKey: topicID,
            },
            payload: {
                // subject: Subject,
                content : Content,
                // templateId: Template.name,
            },
            actor: '99',
          });

        console.log('Event triggered for topic:', _response);
    }catch(error){
        console.log(error);
    }
}

module.exports = {
    createSubscribers,
    initiateSubscribers,
    sender,
}

//make a new template
//hardcode subscriber id
//trigger the event
//find the difference between workflow and template

