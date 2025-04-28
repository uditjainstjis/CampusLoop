const accountSid = 'ACa9d839c5b6d0c48f98f65f75617c8ac2';
const authToken = '[AuthToken]';
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
                from: 'whatsapp:+14155238886',
        contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
        contentVariables: '{"1":"12/1","2":"3pm"}',
        to: 'whatsapp:+918607388004'
    })
    .then(message => console.log(message.sid))
    .done();