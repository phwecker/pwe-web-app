module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.body && req.body.recipie) {
        context.res = {
            status: 200,
            body: {
                message: { code: 0001, text: "recipie saved - " + JSON.stringify(req.body) }
            }
        };
    }
    else {
        context.res = {
            status: 400,
            body: { error: { code: 0002, text: "no recipie provided" } }
        };
    }
};