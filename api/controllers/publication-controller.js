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
        index: "publication",
        query: {
            multi_match: {
                query: query
            }
        }
    })

    return res.status(200).send(result.hits.hits);
}

const filterPublications = async (req, res) => {
    try {
        const { source_type, startYear, endYear, size = 100 } = req.body;

        // Validate input parameters
        if (!(source_type || (startYear || endYear))) {
            return res.status(400).json({
                error: "At least 'source_type' or one of 'startYear' or 'endYear' must be provided."
            });
        }
        

        // Initialize the query object
        const query = {
            bool: {   // This should be an array
                filter: []     // This should be an array too
            }
        };

        // Add source_type filter if provided
        if (source_type) {
            query.bool.filter.push({
                term: { source_type: source_type }
            });
        }

        // Add year filter logic
        if (startYear) {
            if (endYear) {
                // Both startYear and endYear are provided (range filter)
                query.bool.filter.push({
                    range: {
                        year: {
                            gte: startYear,
                            lte: endYear
                        }
                    }
                });
            } else {
                // Only startYear is provided (exact year filter)
                query.bool.filter.push({
                    range: {
                        year: {
                            gte: startYear,
                            lte: startYear
                        }
                    }
                });
            }
        }

        // Perform the Elasticsearch query
        const result = await ESClient.search({
            index: "publication",
            size: size,
            query: query
        });

        // Return the filtered results
        return res.status(200).json({
            total: result.hits.total.value,
            results: result.hits.hits.map(hit => ({
                id: hit._id,
                score: hit._score,
                ...hit._source
            }))
        });
    } catch (error) {
        // Enhanced error logging
        const errorMessage = error.meta?.body?.error?.reason || error.message || 'Unknown error';
        console.error("Error filtering publications:", errorMessage);
        
        return res.status(500).json({ error: "Error filtering publications." });
    }
};



export {
    getTestPublication,
    fullSearch,
    filterPublications
}