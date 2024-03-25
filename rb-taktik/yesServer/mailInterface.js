const fs = require('fs');
const Mailjet = require('node-mailjet');

let mailjet;

async function initApp()
{
    try
    {
        let authData = JSON.parse(fs.readFileSync("./secret/auth.json", "utf8"));
        mailjet = new Mailjet({
            apiKey: authData["public"],
            apiSecret: authData["secret"]
        });

        // let res = await mailjet
        //     .post('send', { version: 'v3.1' })
        //     .request({
        //         Messages: [
        //             {
        //                 From: {
        //                     Email: "rbtaktik@gmail.com",
        //                     Name: "RB-Taktik"
        //                 },
        //                 To: [
        //                     {
        //                         Email: "spam.testspamajajaj@gmail.com",
        //                         Name: "Test Spam"
        //                     }
        //                 ],
        //                 Subject: "Test Email",
        //                 TextPart: "Das ist ein Test",
        //                 HTMLPart: "<h1>Hallo</h1><br><p>Das ist ein Test</p>"
        //             }
        //         ]
        //     });
        //
        // console.log(res);
    }
    catch (e)
    {
        console.log("> Error reading auth.json: " + e);
        console.log("  > You might need to extract the file from the secure rar file.");
        console.log("  > Or create a mailjet account and get the api key and secret from there.");
        console.log("  > Mail interface will not work!")
    }

    console.log("> Initialized mail interface");
}

async function sendMail(to, subject, text, html)
{
    try
    {
        let res = await mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    {
                        From: {
                            Email: "rbtaktik@gmail.com",
                            Name: "RB-Taktik"
                        },
                        To: [
                            {
                                Email: to/*,
                                Name: "Test Spam"*/
                            }
                        ],
                        Subject: subject,
                        TextPart: text,
                        HTMLPart: html
                    }
                ]
            });

        console.log(res);
        return true;
    }
    catch (e)
    {
        console.log("Error sending mail: " + e);
        return false;
    }
}


module.exports = {initApp, sendMail};