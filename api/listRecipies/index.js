module.exports = async function (context, req) {
    context.log('-- listRecipies');

    console.log("AZURE_STORAGE_CONNECTION_STRING: ", process.env.AZURE_STORAGE_CONNECTION_STRING)

    var azure = require('azure-storage');
    var azureTS = require('azure-table-storage-async');

    var tableService = azure.createTableService();

    var count = 3;
    var swatch_array = [{
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
    }];

    var swatch = {
        name: "test 0",
        cyan_pct: 0,
        magenta_pct: 0,
        yellow_pct: 0,
        black_pct: 0
    };
    /*
        var entGen = azure.TableUtilities.entityGenerator;
    
        for (let swatch_record of swatch_array) {
            console.log(swatch_record.name);
            var entity = {
                PartitionKey: entGen.String('PMS'),
                RowKey: entGen.String(swatch_record.name),
                swatch: entGen.String(JSON.stringify(swatch_record))
            };
    
            tableService.insertEntity('swatches', entity, function (error, result, response) {
                if (!error) {
                    console.log("entity stored ", result)
                } else {
                    console.log("error ", error)
                }
            });
        }
    */
    swatch_array = [];

    var query = new azure.TableQuery()
        .top(5)
        .where('PartitionKey eq ?', 'PMS');

    const result = await azureTS.queryAllAsync(tableService, "swatches");

    for (let recipie of result) {
        // swatch_array.push(JSON.parse(recipie.swatch));
        swatch_array.push(JSON.parse(recipie.swatch._))
    }

    if (swatch_array.length > 0) {
        console.log(swatch_array, swatch_array.length)
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: {
                recipies: swatch_array
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