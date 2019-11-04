exports.status = async (req, res) => {
    res.send(200, {data: "server is up and running"})
}