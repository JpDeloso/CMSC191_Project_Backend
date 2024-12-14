import { Client } from "@elastic/elasticsearch";

const ESClient = new Client({
    node: process.env.ES_ENDPOINT,
    auth: {
        apiKey: process.env.API_KEY
    },
    tls: {
        rejectUnauthorized: false
    }
});

const getTestPublication = async (req, res) => {
    return res.status(200).send(JSON.stringify(await ESClient.info()));
};

const fullSearch = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const result = await ESClient.search({
            index: "publications",
            query: {
                multi_match: {
                    query: query
                }
            }
        });

        return res.status(200).send(result.hits.hits);
    } catch (error) {
        console.error('Full search error:', error);
        return res.status(500).json({ error: 'Error performing full search' });
    }
};

const searchByTitle = async (req, res) => {
    try {
        const { query } = req.body; 
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        // Construct a combined query using a `bool` query.
        const esQuery = {
            bool: {
                should: [
                    {
                        match_phrase: {
                            title: query // Exact phrase search
                        }
                    },
                    {
                        match: {
                            title: {
                                query: query,
                                fuzziness: "AUTO",
                                boost: 2 // Boosted relevance
                            }
                        }
                    },
                    {
                        prefix: {
                            title: query // Autocomplete-style search
                        }
                    }
                ],
                minimum_should_match: 1 // At least one condition must match
            }
        };

        // Perform the search query.
        const result = await ESClient.search({
            index: "publications",
            query: esQuery
        });

        // Return the results in a user-friendly format.
        return res.status(200).json({
            total: result.hits.total.value,
            results: result.hits.hits.map(hit => ({
                id: hit._id,
                score: hit._score,
                ...hit._source
            }))
        });
    } catch (error) {
        console.error('Search by title error:', error);
        return res.status(500).json({ error: 'Error performing search by title' });
    }
};


const searchByAuthor = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        // Preprocess query to remove dots and handle case-insensitivity
        const processedQuery = query.toLowerCase().replace(/\./g, '');

        const result = await ESClient.search({
            index: "publications",
            size: 100,
            query: {
                bool: {
                    should: [
                        {
                            match: {
                                authors: {
                                    query: processedQuery,
                                    fuzziness: "AUTO"
                                }
                            }
                        },
                        {
                            wildcard: {
                                authors: {
                                    value: `*${query}*`, // Match partial substrings
                                    case_insensitive: true
                                }
                            }
                        }
                    ],
                    minimum_should_match: 1 // At least one condition should match
                }
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
        console.error('Search by author error:', error);
        return res.status(500).json({ error: 'Error searching by author' });
    }
};

const searchByIndexTerms = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const result = await ESClient.search({
            index: "publications",
            query: {
                match: {
                    indexTerms: {
                        query: query,
                        fuzziness: "AUTO"
                    }
                }
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
        console.error('Search by index terms error:', error);
        return res.status(500).json({ error: 'Error searching by index terms' });
    }
};

export {
    getTestPublication,
    fullSearch,
    searchByTitle,
    searchByAuthor,
    searchByIndexTerms
};
