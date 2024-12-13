const getTestUser = (req, res, err) => {
    return res.status(200).send({ message: "Sample User"})
}

export {
    getTestUser
}