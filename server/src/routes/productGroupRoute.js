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
            'select		pgCd, pgName \
			from		TB_PDG \
			order by	pgCd',
            function (error, result) {
                if (error)
                    res.json({ success: false, error: 'ServerError', message: error })
                else
                    res.json({ success: true, list: result })
            })
    })
    .post(function (req, res) {
        const { usn } = req.body
        const { pgCd, pgName } = req.body.pg
        pool.getConnection(function (err, connection) {
            if (err)
                res.json({ success: false, error: 'ServerError', message: error })
            else {
                connection.query(
                    'select     count(pgCd) \
                                as count \
                    from        TB_PDG \
                    where	    pgCd = ?',
                    pgCd,
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
                                'insert into    TB_PDG (pgCd, pgName, createdBy, modifiedBy) \
                                values( ?, ?, ?, ?)', [pgCd, pgName, usn, usn],
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
        const { pgCd, pgName } = req.body.pg
        pool.query(
            'update     TB_PDG \
            set         pgName = ?, modifiedBy = ? \
            where       pgCd = ?',
            [pgName, usn, pgCd],
            function (error, result) {
                if (error)
                    res.json({ success: false, error })
                else
                    res.json({ success: true })
            })
    })

module.exports = router;