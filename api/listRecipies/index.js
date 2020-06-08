module.exports = async function (context, req) {
    context.log('-- listRecipies');
    var count = 3;

    if (count > 0) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: {
                recipies: [{
                    name: "test 0",
                    cyan_pct: 0,
                    magenta_pct: 0,
                    yellow_pct: 0,
                    black_pct: 0
                },
                {
                    name: "test 50",
                    cyan_pct: 50,
                    magenta_pct: 50,
                    yellow_pct: 50,
                    black_pct: 50
                },
                {
                    name: "test 485c",
                    cyan_pct: 0,
                    magenta_pct: 81,
                    yellow_pct: 87,
                    black_pct: 15
                },
                {
                    name: "test 100",
                    cyan_pct: 100,
                    magenta_pct: 100,
                    yellow_pct: 100,
                    black_pct: 100
                }]
            }
        };
    }
    else {
        context.res = {
            status: 400,
            body: { error: { code: 1001, text: "no recipies found" } }
        };
    }
};