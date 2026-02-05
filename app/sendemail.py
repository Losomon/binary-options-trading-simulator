import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


def send_email(otp, user_email):
    message = Mail(

        from_email='thumbi.18878@students.kyu.ac.ke',
        to_emails=user_email,
        subject='verification code',
        html_content=f'<p>your OTP is <strong>{otp}</strong></p>')
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        # sg.set_sendgrid_data_residency("eu")
        # uncomment the above line if you are sending mail using a regional EU subuser
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e)

    return None
