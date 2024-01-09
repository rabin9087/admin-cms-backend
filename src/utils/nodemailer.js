import nodemailer from 'nodemailer'
//smpt configuration
//email body
//send email

const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    auth: {
        user: process.env.SMPT_USER,
        pass: process.env.SMPT_PASSWORD
    }
});

const emailSender = async (obj) => {
    try {
        const info = await transporter.sendMail(obj);
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.log(error)
    }
}

export const sendEmailVerificationLinkEMail = ({ email, fName, url }) => {
    const body = {
        from: `"Tech Gare 👻" <${process.env.SMPT_USER}>`, // sender address
        to: email, // list of receivers
        subject: "Verify your Tech Gare accout", // Subject line
        text: `Hello ${fName}, please follow the link to verify your account ${url}\n\n Regards, \n Tech Gare`, // plain text body
        html: `<p>Hello ${fName}</p>
        <br/> <br/>
        <p>thank you for creating account with us. Click the button to verify your account</p>
        <p>
            <a href=${url}>
                <button style="background: green; padding: 1rem; color white; font-weight: bolder">Verify</button>
            </a>
        </p>
    
        <br/>
        <p>If </p>
        <br/>
        -----------
        <p>
            Regards, 
            <br/>
            Tech Gare 
            <br/>
    
        </p>`

        // html body
    }

    emailSender(body)
}

export const sendEmailVerifiedNotificationEmail = ({ email, fName }) => {
    const body = {
        from: `"Tech Gare 👻" <${process.env.SMPT_USER}>`, // sender address
        to: email, // list of receivers
        subject: "Your email has been verified", // Subject line
        text: `Hello ${fName}, Your email has been verified, You can login now \n\n Regards, \n Tech Gare`, // plain text body
        html: `<p>Hello ${fName}</p>
        -----------
        <p>
            Regards, 
            <br/>
            Tech Gare 
            <br/>
        </p>`

        // html body
    }

    emailSender(body)
}