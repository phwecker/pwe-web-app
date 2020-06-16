module.exports = async function (context, req) {
    context.log('-- recipie');

    const swatchId = context.bindingData.swatchid;
    const method = req.method

    var azure = require('azure-storage');
    var azureTS = require('azure-table-storage-async');

    var tableService = azure.createTableService();

    console.log(method, swatchId)

    if (swatchId && method == "GET") {

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