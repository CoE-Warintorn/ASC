const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const pool = mysql.createPool({
    host    : 'localhost',
    user    : 'admin_it_asc',
    password: 'ez@uuzrt#asc!',
	port: '5432',
    database: 'db_asc'
});

router.route('/')
    .get(function (req, res) {
        pool.query(
            'select		username, adminInd, \
                        date_format(startDate, "%Y-%m-%d") \
                            as startDate, \
                        date_format(endDate, "%Y-%m-%d") \
                            as endDate \
			from		TB_USR_CTL \
			order by	username',
            function (error, result) {
                if (error)
                    res.json({ success: false, error: 'ServerError', message: error })
                else
                    res.json({ success: true, list: result })
            })
    })
    .post(function (req, res) {
        const { usn } = req.body
        const { username, startDate, endDate, adminInd } = req.body.user
        pool.getConnection(function (err, connection) {
            if (err)
                res.json({ success: false, error: 'ServerError', message: error })
            else {
                connection.query(
                    'select     count(username) \
                                as count \
                    from        TB_USR_CTL \
                    where	    username = ?',
                    username,
                    function (error, result) {
                        if (error) {
                            connection.release();
                            res.json({ success: false, error: 'ServerError', message: error })
                        }
                        else if (result[0].count > 0) {
                            connection.release();
                            res.json({ success: false, error: 'Exist' });
                        }
                        else
                            connection.query(
                                'insert into    TB_USR_CTL (username, startDate, endDate, adminInd, createdBy, modifiedBy) \
                                values( ?, ?, ?, ?, ?, ?)', [username, startDate, endDate, adminInd, usn, usn],
                                function (error, result) {
                                    connection.release();
                                    if (error)
                                        res.json({ success: false, error: 'ServerError', message: error })
                                    else
                                        res.json({ success: true, result });
                                }
                            )
                    })
            }
        })
    })
    .put(function (req, res) {
        const { usn } = req.body
        const { username, endDate, adminInd } = req.body.user
        pool.query(
            'update     TB_USR_CTL \
            set         endDate = ?, adminInd = ?, \
                        modifiedBy = ? \
            where       username = ?',
            [endDate, adminInd, usn, username],
            function (error, result) {
                if (error)
                    res.json({ success: false, error })
                else
                    res.json({ success: true })
            })
    })

module.exports = router;