const express = require('express');
const router = express.Router();

const pool = require('../connector');

router.route('/')
    .get(function (req, res) {
        pool.query(
            'select		branchCd, branchName \
			from		TB_BRCH \
			order by	branchCd',
            function (error, result) {
                if (error)
                    res.json({ success: false, error: 'ServerError', message: error })
                else
                    res.json({ success: true, list: result })
            })
    })
    .post(function (req, res) {
        const { usn } = req.body
        const { branchCd, branchName } = req.body.branch
        pool.getConnection(function (err, connection) {
            if (err)
                res.json({ success: false, error: 'ServerError', message: error })
            else {
                connection.query(
                    'select     count(branchCd) \
                                as count \
                    from        TB_BRCH \
                    where	    branchCd = ?',
                    branchCd,
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
                                'insert into    TB_BRCH (branchCd, branchName, createdBy, modifiedBy) \
                                values( ?, ?, ?, ?)', [branchCd, branchName, usn, usn],
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
        const { branchCd, branchName } = req.body.branch
        pool.query(
            'update     TB_BRCH \
            set         branchName = ?, modifiedBy = ? \
            where       branchCd = ?',
            [branchName, usn, branchCd],
            function (error, result) {
                if (error)
                    res.json({ success: false, error })
                else
                    res.json({ success: true })
            })
    })
    
module.exports = router;