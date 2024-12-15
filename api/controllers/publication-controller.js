import { Client } from "@elastic/elasticsearch";

const ESClient = new Client({
    node: process.env.ES_ENDPOINT,
    auth: {
        apiKey: process.env.API_KEY
    }
})

const getTestPublication = async (req, res, err) => {
    return res.status(200).send(JSON.stringify(await ESClient.info()))
}

const fullSearch = async (req, res) => {
    const { query } = req.body;

    const result = await ESClient.search({
        index: "publications",
        query: {
            multi_match: {
                query: query
            }
        }
    })

    return res.status(200).send(result.hits.hits);
}

// const sortPublications = async (req, res) => {
//     try {
//         const { sortField, sortOrder = "asc", size = 100 } = req.body;

//         if (!sortField) {
//             return res.status(400).json({ error: "Sort field is required." });
//         }

//         const result = await ESClient.search({
//             index: "publication",
//             size: size,
//             sort: [
//                 { [sortField]: { order: sortOrder } }
//             ],
//             query: {
//                 match_all: {}
//             }
//         });

//         return res.status(200).json({
//             total: result.hits.total.value,
//             results: result.hits.hits.map(hit => ({
//                 id: hit._id,
//                 score: hit._score,
//                 ...hit._source
//             }))
//         });

//     } catch (error) {
//         console.error("Error sorting publications:", error.meta?.body?.error || error);
//         return res.status(500).json({ error: "Error sorting publications." });
//     }
// };

const sortPublications = async (req, res) => {
    try {
        const { sortField, sortOrder = "asc", size = 100 } = req.body;

        // ensure valid fields
        const validFields = ["year", "title"];
        if (!sortField || !validFields.includes(sortField)) {
            return res.status(400).json({ error: "Invalid or missing sort field. Valid fields are: 'year' or 'title'." });
        }

        const result = await ESClient.search({
            index: "publication",
            size: size,
            sort: [
                { [sortField]: { order: sortOrder } }
            ],
            query: {
                match_all: {}
            }
        });

        return res.status(200).json({
            total: result.hits.total.value,
            results: result.hits.hits.map(hit => ({
                id: hit._id,
                score: hit._score,
                ...hit._source
            }))
        });

    } catch (error) {
        console.error("Error sorting publications:", error.meta?.body?.error || error);
        return res.status(500).json({ error: "Error sorting publications." });
    }
};

export {
    getTestPublication,
    fullSearch,
    sortPublications
}