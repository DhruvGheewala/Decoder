const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

module.exports = async (toMail, subject, htmlFile, name, url) => {
  const handlebarsOptions = {
    viewEngine: {
      extName: '.html',
      defaultLayout: ''//set this one empty and provide your template below,
    },
    viewPath: path.join(__dirname, '/templates'),
    extName: '.html',
  };

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  transporter.use('compile', hbs(handlebarsOptions));
  var mail = {
    to: toMail,
    from: process.env.EMAIL_ID,
    subject: subject,
    template: htmlFile,
    context: {
      url: url,
      name: name
    }
  }
  transporter.sendMail(mail, (err) => {
    console.log(err);
  });
}