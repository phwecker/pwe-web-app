module.exports = async function (context, req) {
    context.log('-- recipie');

    const swatchId = context.bindingData.swatchid;
    const method = req.method

    var azure = require('azure-storage');
    var azureTS = require('azure-table-storage-async');

    var tableService = azure.createTableService();

    console.log(method, swatchId)

    if (!swatchId && method == "GET") {
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
    } else if (swatchId && method == "GET") {

        result = await azureTS.retrieveEntityAsync(tableService, 'swatches', 'PMS', swatchId);
        if (result) {
            console.log(result);
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: {
                    recipie: JSON.parse(result.swatch._)
                }
            };
        } else {
            context.res = {
                status: 404,
                body: {
                    error: { code: 0002, text: "recipie not found" }
                }
            };
        }
    } else if (swatchId && method == "DELETE") {
        var entGen = azure.TableUtilities.entityGenerator;
        var myentity = {
            PartitionKey: entGen.String('PMS'),
            RowKey: entGen.String(swatchId)
        };
        await azureTS.deleteEntityAsync(tableService, 'swatches', myentity);

        context.res = {
            status: 200,
            body: {
                error: { code: 0001, text: "recipie deleted (" + swatchId + ")" }
            }
        };
    } else if (method == "POST" && req.body) {
        var entGen = azure.TableUtilities.entityGenerator;

        var swatch_record = req.body.recipie || req.body;

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
            body: {
                error: { code: 0001, text: "recipie id missing" }
            }
        };
    }
};