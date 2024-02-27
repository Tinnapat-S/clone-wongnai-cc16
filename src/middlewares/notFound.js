const path = require("path")
const { public_dir } = require("../../public/dir")

module.exports.notFound = async (req, res) => {
    res.status(404).sendFile(path.join(public_dir, "/not_found.html"))
}
