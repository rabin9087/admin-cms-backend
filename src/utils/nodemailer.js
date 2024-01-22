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
                <button style="background: green; padding: 1rem; color: white; font-weight: bolder">Verify</button>
            </a>
        </p>
    
        <br/>
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

export const sendOTPEmail = ({ email, fName, otp }) => {
    const body = {
        from: `"Tech Gare 👻" <${process.env.SMPT_USER}>`, // sender address
        to: email, // list of receivers
        subject: "Your OTP for password reset", // Subject line
        text: `Hello ${fName}, here is your otp ${otp} \n\n Regards, \n Tech Gare`, // plain text body
        html: `<p>Hello ${fName}</p>
        <br/> <br/>
        <p>Here is th eOPT to set Your password</p>
        <p style="font-size:3rem; color: red">
          ${otp}
        </p>
    
        <br/>
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

export const passwordUpdateNotificationEmail = ({ email, fName }) => {
    const body = {
        from: `"Tech Gare 👻" <${process.env.SMPT_USER}>`, // sender address
        to: email, // list of receivers
        subject: "Your password has been updated", // Subject line
        text: `Hello ${fName}, Your password has been updated. If this was not you please contact us or change password ASAP \n\n Regards, \n Tech Gare`, // plain text body
        html: `<p>Hello ${fName}</p>
        <br/> <br/>
        <p>Hello ${fName}, Your password has been updated. If this was not you please contact us or change password ASAP</p>
       
        <br/>
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