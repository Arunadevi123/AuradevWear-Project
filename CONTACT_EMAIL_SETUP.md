# Contact Form Email Setup

The contact form saves messages to the database first, then sends an email through SMTP.
If `MAIL_USERNAME` or `MAIL_PASSWORD` is missing, the backend returns:

`Message saved, but email is not configured. Set MAIL_USERNAME and MAIL_PASSWORD.`

## Local Gmail Setup

1. Copy `.env.example` to `.env` in the `Backend` folder.
2. Set `MAIL_USERNAME` to the Gmail account that will send the email.
3. Set `MAIL_PASSWORD` to a Gmail app password, not your normal Gmail password.
4. Restart the Spring Boot backend.

Example:

```properties
MAIL_USERNAME=example@gmail.com
MAIL_PASSWORD=abcd efgh ijkl mnop
CONTACT_RECIPIENT=kumaranarunadevi@gmail.com
```

For Gmail, the account usually needs 2-Step Verification enabled before Google lets you create an app password.
