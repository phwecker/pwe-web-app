module.exports = async function (context, req) {
    console.log('REQUEST BODY', req.body)

    if (req.body || req.body.recipie) {

        var azure = require('azure-storage');
        var azureTS = require('azure-table-storage-async');

        var tableService = azure.createTableService();

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
    } else {
        context.res = {
            status: 400,
            body: { error: { code: 0002, text: "no recipie provided" } }
        };
    }
};