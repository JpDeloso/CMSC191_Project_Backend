const getTestPublication = (req, res, err) => {
    return res.status(200).send({ message: "Sample Publication"})
}

export {
    getTestPublication
}