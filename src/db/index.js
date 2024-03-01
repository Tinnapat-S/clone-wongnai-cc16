const mysql = require("mysql2/promise")

const pool = mysql.createPool({
    host: "103.74.254.49",
    port: "8000",
    user: "User3",
    password: "ccgrp16200324",
    database: "GROUP3",
})

const execute = async (sql, value) => {
    const [result] = await pool.execute(sql, value)
    return result
}
module.exports = { execute, pool }
