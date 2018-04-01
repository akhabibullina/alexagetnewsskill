/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');
const https = require('https');

const APP_ID = "amzn1.ask.skill.ce7c1fd1-b4e2-44c4-b2b2-2ab26ca84a90";  // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            FACTS: [
                'A year on Mercury is just 88 days long.',
                'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
                'Venus rotates anti-clockwise, possibly because of a collision in the past with an asteroid.',
                'On Mars, the Sun appears about half the size as it does on Earth.',
                'Earth is the only planet not named after a god.',
                'Jupiter has the shortest day of all the planets.',
                'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
                'The Sun contains 99.86% of the mass in the Solar System.',
                'The Sun is an almost perfect sphere.',
                'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
                'Saturn radiates two and a half times more energy into space than it receives from the sun.',
                'The temperature inside the Sun can reach 15 million degrees Celsius.',
                'The Moon is moving approximately 3.8 cm away from our planet every year.',
            ],
            NEWS: [
                'news 1',
                'news 2',
                'news 3',
            ],
            SKILL_NAME: 'Anna\'s Assistant',
            GET_FACT_MESSAGE: "Here's your fact: ",
            GET_NEWS_MESSAGE: "News number ",
            GET_NEWS_HEADERS_MESSAGE: "Here are the headers of top 3 news today: ",
            HELP_MESSAGE: 'You can say tell me a space fact, or, you can say exit... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    },
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'GetNewFactIntent': function () {
        this.emit('GetFact');
    },
    'GetNewsUAIntent': function () {
        this.emit('GetNewsUA');
    },
    'GetNewsUA': function () {
        var location = 'https://www.kyivpost.com';
        httpsGet(location, function (newsHeadersArr) {

            var content = '';

            for (var i = 0; i < newsHeadersArr.length; i++) {
                content += "News number " +  (i + 1) + ': ' + newsHeadersArr[i] + '. ';
            }

            console.log (content);
            console.log (this.sessionAttributes);

            var speechOutput = this.t('GET_NEWS_HEADERS_MESSAGE') + content;
            var prompt = 'Which one do you want to hear next: one, two or three?';
            var reprompt = 'Sorry I didnt get that. Please say that again?';

            this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), content);
            // todo: reprompt
            this.emit(':ask', prompt, reprompt);

        }.bind(this)); 
    },

    'GetFact': function () {
        // Get a random space fact from the space facts list
        // Use this.t() to get corresponding language data
        const factArr = this.t('FACTS');
        const factIndex = Math.floor(Math.random() * factArr.length);
        const randomFact = factArr[factIndex];

        // Create speech output
        const speechOutput = this.t('GET_FACT_MESSAGE') + randomFact;
        this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), randomFact);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function httpsGet(hostname, callback) {

    var req = https.get('https://www.kyivpost.com', (res) => {

        var returnData = '';

        res.on('data', (chunk) => {
            returnData += chunk;
        });

        res.on('end', function () {

            var regexp = /<span class="underline">.*?<\/span>/gi;
            var found = returnData.match(regexp);
            var newsHeader = '';
            var newsHeadersArr = [];

            for (var i = 0; i < 3; i++) {
                var str = found[i];
                newsHeader = str.substring("<span class='underline'>".length, str.length - "<\/span>".length);
                newsHeadersArr.push(newsHeader);
            }

            callback(newsHeadersArr);
        }); 

    }); 


    req.end();

    req.on('error', (e) => {
        console.error(e);
    }); 

}
