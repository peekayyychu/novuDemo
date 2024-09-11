const { Novu, FilterPartTypeEnum, TemplateVariableTypeEnum, StepTypeEnum, TriggerRecipientsTypeEnum} =  require('@novu/node');
const apiKey = 'f67f91f0ce1f2ce1295b9c23fa9c7373';
const axios = require('axios');
const errors = require('sails-hook-sockets/lib/errors');
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
            name: 'Alert',
        })
        console.log('Topic created successfully');
    }
}

async function subscribeTopic(topicID, subscriberIDs){
    const topicSubscribed = await novu.topics.addSubscribers(topicID, {
        subscribers: [subscriberIDs[1], subscriberIDs[0]],
    })

    if(!topicSubscribed){
        console.log('Topic subscribption: Unsuccessful');
    }

    return topicSubscribed;
}

async function createTemplate(topicSubscribed, Subject, Content, topicID) {

    let template = await novu.notificationTemplates.create({
        name: topicID,
        active: true,
        notificationGroupId: topicSubscribed.data.subscribers,

        triggers: [
            {
                identifier: 'alerttest1232-E14RrTYYo',
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
                    content: [
                        {
                            type: 'text',
                            content: Content,
                        }
                    ],
                    // to: '{{emailID}}',
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


async function sender(Subject, Content, subscriberIDs, topicID){

    try{
        await createTopic(topicID, Subject);
        const topicSubscribed = await subscribeTopic(topicID, subscriberIDs);
        const workflowGroupsData = await fetchWorkFlow();

        

        if(!topicSubscribed) throw console.error('Cant subscribe to topic');
        else console.log(topicSubscribed);

        // let subscribers = topicSubscribed.data.succeeded;
        
        // const Template = await createTemplate(subscribers, Subject, Content, topicID);
        // const Template = await createTemplate(workflowGroupsData);

        // console.log('Template data:', Template);

        // const _response = await novu.trigger('alerttest1232-E14RrTYYo', {
        //     to: {
        //         type: TriggerRecipientsTypeEnum.TOPIC,
        //         topicKey: topicID,
        //     },
        //     payload: {

        //     },
        //   });

        await novu.trigger('alerttest1232-E14RrTYYo', {
          to: {
            type: 'Topic',
            topicKey: topicID,
          },
          payload: {
            subject: 'Your Email Subject',
            preheader: 'A brief summary of the email content',
            body: {
              greeting: 'Hello',
              mainContent: 'This is the main content of your email.',
              callToAction: {
                text: 'Click Here',
                link: 'https://example.com'
              },
              closing: 'Thank you for your attention.'
            },
            attachments: [
              {
                file: 'base64-encoded-file-content',
                name: 'attachment.pdf'
              }
            ],
            customVariables: {
              userName: '{{subscriber.firstName}}',
              companyName: 'Your Company'
            }
          }
        });

        // console.log('Event triggered for topic:', _response);
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

/*
import { workflow } from "@novu/framework";

const myWorkflow = workflow(
  "new-signup",
  async ({ step, payload }) => {
    // Send a welcome email
    await step.email("send-email", async () => {
      return {
        subject: `Welcome to Acme, ${payload.name}`,
        body: "We look forward to helping you achieve mission.",
      };
    });

    // Wait for 1 week
    await step.delay("onboarding-follow-up", async () => ({
      amount: 1,
      unit: "weeks",
    }));

    // Send a follow-up in-app notification
    await step.inApp(
      "onboarding-follow-up",
      async (inputs) => {
        return {
          body: `Hey ${payload.name}! How do you like the product?

Let us know <a href="${inputs.feedbackUrl}">here</a>
if you have any questions.`,
        };
      },
      {
        skip: () => !payload.shouldFollowUp,
        controlSchema: {
          type: "object",
          properties: {
            feedbackUrl: {
              type: "string",
              format: "uri",
              default: "https://acme.com/feedback",
            },
          },
          required: ["feedbackUrl"],
          additionalProperties: false,
        } as const,
      }
    );
  },
  {
    payloadSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        shouldFollowUp: { type: "boolean", default: true },
      },
      required: ["name"],
      additionalProperties: false,
    } as const,
  }
);
*/