(function() {
  // Mail link
  const MAIL_LINK = 'https://formcarry.com/s/mTVwC0PfIo8';
  
  // States
  const SPINNER_HIDE_STATE = 'hide-spinner';
  const ERROR_MESSAGE_HIDE_STATE = 'error-message-hidden';
  const FORM_HIDE_STATE = 'hide-form';
  const FORM_STATUS_HIDE_STATE = 'hide-form-status';

  // Status code
  const SUCCESS_CODE = 200;
  const ERROR_CLIENT_CODE = 400;
  const ERROR_SERVER_CODE = 500;

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.footer__contact-form');
    const formBtn = document.querySelector('.footer__submit');
    const mailInput = document.querySelector('.footer__input[name="Mail"]');
    const subjectInput = document.querySelector('.footer__input[name="Subject"]');
    const messageInput = document.querySelector('.footer__input[name="Message"]');
    const errorContainer = document.querySelector('.error-container');
    const errorMessages = document.querySelectorAll('.error-message');
    const spinner = document.querySelector('.spinner-container');
    const formStatus = document.querySelector('.footer__contact-status');
    
    formBtn.addEventListener('click', async function (ev) {
      ev.preventDefault();
      const mail = mailInput.value;
      const subject = subjectInput.value;
      const message = messageInput.value;
      errorMessages.forEach(errorMessage => errorMessage.classList.add(ERROR_MESSAGE_HIDE_STATE));
      if (validateEmail(mail) && subject && message) {
        spinner.classList.remove(SPINNER_HIDE_STATE);
        await sendForm(mail, subject, message);
      } else {
        !validateEmail(mail) && errorContainer.querySelector('.invalid-mail').classList.remove(ERROR_MESSAGE_HIDE_STATE);
        !subject && errorContainer.querySelector('.invalid-subject').classList.remove(ERROR_MESSAGE_HIDE_STATE);
        !message && errorContainer.querySelector('.invalid-message').classList.remove(ERROR_MESSAGE_HIDE_STATE);
      }
    });

    function validateEmail (email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    async function sendForm (email, subject, message) {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('subject', subject);
      formData.append('message', message);
      const response = await fetch(MAIL_LINK, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });
      const result = await response.json();
      if (result.code === SUCCESS_CODE) {
        formStatus.innerHTML = 'The message was sent successfully. You will be contact soon';
      } else if (result.code >= ERROR_CLIENT_CODE && result.code < ERROR_SERVER_CODE) {
        formStatus.innerHTML = 'There was an error sending the message';
      } else {
        formStatus.innerHTML = 'There was an unexpecting error sending the message';
      }
      form.classList.add(FORM_HIDE_STATE);
      formStatus.classList.remove(FORM_STATUS_HIDE_STATE);
      spinner.classList.add(SPINNER_HIDE_STATE);
    }
  });
})();