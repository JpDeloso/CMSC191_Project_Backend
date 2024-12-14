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

export {
    getTestPublication,
    fullSearch
}