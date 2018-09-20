const express = require('express');
const router = express.Router();

const pool = require('../connector');

router.route('/')
    .get(function (req, res) {
        pool.query(
            'select		divCd, divName \
			from		TB_DIV \
			order by	divCd',
            function (error, result) {
                if (error)
                    res.json({ success: false, error: 'ServerError', message: error })
                else
                    res.json({ success: true, list: result })
            })
    })
    .post(function (req, res) {
        const { usn } = req.body
        const { divCd, divName } = req.body.div
        pool.getConnection(function (err, connection) {
            if (err)
                res.json({ success: false, error: 'ServerError', message: error })
            else {
                connection.query(
                    'select     count(divCd) \
                                as count \
                    from        TB_DIV \
                    where	    divCd = ?',
                    divCd,
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
                                'insert into    TB_DIV (divCd, divName, createdBy, modifiedBy) \
                                values( ?, ?, ?, ?)', [divCd, divName, usn, usn],
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
        const { divCd, divName } = req.body.div
        pool.query(
            'update     TB_DIV \
            set         divName = ?, modifiedBy = ? \
            where       divCd = ?',
            [divName, usn, divCd],
            function (error, result) {
                if (error)
                    res.json({ success: false, error })
                else
                    res.json({ success: true })
            })
    })

module.exports = router;