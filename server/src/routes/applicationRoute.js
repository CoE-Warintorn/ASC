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
        'select		appCd, appName, active \
			from		TB_APP \
			order by	appCd',
        function (error, result) {
            if (error)
                res.json({ success: false, error: 'ServerError', message: error })
            else
                res.json({ success: true, list: result })
        })
    })
    .post(function (req, res) {
        const { usn } = req.body
        const { appCd, appName, active } = req.body.app
        pool.getConnection(function (err, connection) {
            if (err)
                res.json({ success: false, error: 'ServerError', message: error })
            else {
                connection.query(
                    'select     count(appCd) \
                                as count \
                    from        TB_APP \
                    where	    appCd = ?',
                    appCd,
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
                                'insert into    TB_APP (appCd, appName, active, createdBy, modifiedBy) \
                                values( ?, ?, ?, ?, ?)', [appCd, appName, active, usn, usn],
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
        const { appCd, appName, active } = req.body.app
        pool.query(
            'update     TB_APP \
            set         appName = ?, active = ?, modifiedBy = ? \
            where       appCd = ?',
            [appName, active, usn, appCd],
            function (error, result) {
                if (error)
                    res.json({ success: false, error })
                else
                    res.json({ success: true })
            })
    })

module.exports = router;