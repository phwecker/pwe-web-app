module.exports = async function (context, req) {
    context.log('-- getRecipie');

    if (req.query.name || (req.body && req.body.name)) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: {
                recipie: {
                    name: (req.query.name || req.body.name),
                    cyan_pct: 0,
                    magenta_pct: 0,
                    yellow_pct: 0,
                    black_pct: 0
                }
            }
        };
    }
    else {
        context.res = {
            status: 400,
            body: {
                error: { code: 0001, text: "recipie name missing" }
            }
        };
    }
};