import fetch from "node-fetch";

exports.handler = async function (event, context) {
    const response = await fetch(`${process.env.SERVER_ADDRESS}/verifyAddress`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: event.body
    })

    // above this is the front end requesting the express server to check stuff or whatever

    // below this is the response from the express server
    const json = await response.json()

    return {
        body: JSON.stringify(json),
        statusCode: 200,
    };
}
