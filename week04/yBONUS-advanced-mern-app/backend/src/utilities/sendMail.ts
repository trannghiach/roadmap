import resend from "../config/resend";
import { EMAIL_SENDER, NODE_ENV } from "../constants/env";


type Params = {
    to: string,
    subject: string,
    text: string,
    html: string
}

const getEmailFrom = () => {
    return NODE_ENV === "development" ? "onboarding@resend.dev" : EMAIL_SENDER;
}

const getEmailTo = (to: string) => {
    return NODE_ENV === "development" ? "delivered@resend.dev" : to;
}

const sendMail = async ({ to, subject, text, html}: Params) => {
    await resend.emails.send({
        from: getEmailFrom(),
        to: getEmailTo(to),
        subject,
        text,
        html
    });
};

export default sendMail;