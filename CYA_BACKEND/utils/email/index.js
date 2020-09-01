const path = require('path');
const nodemailer = require('nodemailer');
const Email = require('email-templates');
const { config } = require('../../config');

const EMAIL_HOST = encodeURIComponent(config.emailHost);
const EMAIL_PORT = Number(encodeURIComponent(config.emailPort));
const EMAIL_USER = config.emailUser;
const EMAIL_ADMIN = config.emailAdmin;
const EMAIL_PASSWORD = config.emailPassword;

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

const cancellationOrder = (product) => {
  const email = new Email({
    transport: transporter,
    send: true,
    preview: false,
  });
  email.send({
    template: path.join(__dirname, 'templates', 'cancellationOrder'),
    message: {
      from: `CYA <${EMAIL_USER}>`,
      to: `${EMAIL_ADMIN}`,
    },
  });
};

module.exports = { cancellationOrder };
