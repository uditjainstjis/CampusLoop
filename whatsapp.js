const accountSid = 'ACa9d839c5b6d0c48f98f65f75617c8ac2';
const authToken = '9437293c1d9ae32f0730f51b8a60e6fb'; // Replace this
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
    from: 'whatsapp:+14155238886', // Twilio sandbox number
    contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e', // Your WhatsApp template SID
    contentVariables: JSON.stringify({
      "1": "12/1", // Placeholder 1
      "2": "3pm"   // Placeholder 2
    }),
    to: 'whatsapp:+918607388004'
  })
  .then(message => console.log('Message SID:', message.sid))
  .catch(err => console.error('Error:', err));
