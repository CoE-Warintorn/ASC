const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'db_asc'
});

router.route('/')
    .post(function (req, res) {
        const { usn } = req.body
        const { astCd, itSupporter, repairDate, returnDate, detail } = req.body.rh
        pool.getConnection(function (err, connection) {
            if (err)
                res.json({ success: false, error: 'ServerError', message: error })
            else {
                connection.query(
                    'select     count(astCd) \
                                as count \
                    from        TB_REPAIR \
                    where	    astCd = ? \
                        and     repairDate = ?',
                    [astCd, repairDate],
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
                                'select     count(username) \
                                            as count \
                                from        TB_USR \
                                where	    username = ?',
                                itSupporter,
                                function (error, result) {
                                    if (error) {
                                        connection.release();
                                        res.json({ success: false, error: 'ServerError', message: error })
                                    }
                                    else if (result[0].count == 0) {
                                        connection.release();
                                        res.json({ success: false, error: 'NoUsername' });
                                    }
                                    else
                                        connection.query(
                                            'insert into    TB_REPAIR (astCd, itSupporter, repairDate, returnDate, detail, \
                                                            createdBy, modifiedBy) \
                                            values(?, ?, ?, ?, ?, ?, ?)',
                                            [astCd, itSupporter, repairDate, returnDate, detail, usn, usn],
                                            function (error, result) {
                                                connection.release();
                                                if (error)
                                                    res.json({ success: false, error: 'ServerError', message: error })
                                                else
                                                    res.json({ success: true, result });
                                            }
                                        )
                                })
                    })
            }
        })
    })
    .put(function (req, res) {
        const { usn } = req.body
        const { astCd, itSupporter, repairDate, returnDate, detail } = req.body.rh
        pool.getConnection(function (err, connection) {
            if (err)
                res.json({ success: false, error: 'ServerError', message: error })
            else {
                connection.query(
                    'select     count(username) \
                                            as count \
                                from        TB_USR \
                                where	    username = ?',
                    itSupporter,
                    function (error, result) {
                        if (error) {
                            connection.release();
                            res.json({ success: false, error: 'ServerError', message: error })
                        }
                        else if (result[0].count == 0) {
                            connection.release();
                            res.json({ success: false, error: 'NoUsername' });
                        }
                        else
                            connection.query(
                                'update     TB_REPAIR \
                                set 		itSupporter = ?, returnDate = ?, detail = ?, modifiedBy = ? \
                                where		astCd = ? \
                                    and     repairDate = ?',
                                [itSupporter, returnDate, detail, usn, astCd, repairDate],
                                function (error, result) {
                                    if (error) {
                                        connection.release();
                                        res.json({ success: false, error })
                                    }
                                    else {
                                        connection.release();
                                        res.json({ success: true })
                                    }
                                })
                    })
            }
        })

    })

router.route('/:astCd&:repairDate')
    .get(function (req, res) {
        pool.query(
            'select		astCd, itSupporter, \
                        date_format(repairDate, "%Y-%m-%d") as repairDate, \
                        date_format(returnDate, "%Y-%m-%d") as returnDate, \
                        detail \
            from        TB_REPAIR \
            where       astCd = ? \
                and     repairDate = ?',
            [req.params.astCd, req.params.repairDate],
            function (error, result) {
                if (error)
                    res.json({ success: false, error: 'ServerError', message: error })
                else
                    res.json({ success: true, list: result })
            })
    })

router.route('/search')
    .post(function (req, res) {
        const { astCd, pgCd, pdCd, repairDate, returnDate, itSupporter, detail } = req.body.rh
        let count = 0
        let queryString = 'select		TB_REPAIR.astCd, pgName, pdName, \
                                        date_format(repairDate, "%Y-%m-%d") as repairDate, \
                                        date_format(returnDate, "%Y-%m-%d") as returnDate, \
                                        itSupporter, TB_REPAIR.detail \
                            from		TB_REPAIR \
                            inner join	TB_AST \
                                    on	TB_REPAIR.astCd = TB_AST.astCd \
                            inner join 	TB_PRD \
                                    on	TB_AST.pdCd = TB_PRD.pdCd \
                            inner join 	TB_PDG \
                                    on	TB_PRD.pgCd = TB_PDG.pgCd '
        if (astCd !== '')
            queryString += ((count++) ? 'and' : 'where') + ` TB_REPAIR.astCd like "%${astCd}%" `
        if (pgCd !== '' && pgCd !== 'all')
            queryString += ((count++) ? 'and' : 'where') + ` TB_PRD.pgCd = "${pgCd}" `
        if (pdCd !== '' && pdCd !== 'all')
            queryString += ((count++) ? 'and' : 'where') + ` TB_AST.pdCd = "${pdCd}" `
        if (repairDate !== '')
            queryString += ((count++) ? 'and' : 'where') + ` repairDate >= "${repairDate}" `
        if (returnDate !== '')
            queryString += ((count++) ? 'and' : 'where') + ` returnDate <= "${returnDate}" `
        if (itSupporter !== '')
            queryString += ((count++) ? 'and' : 'where') + ` itSupporter like "%${itSupporter}%" `
        if (detail !== '')
            queryString += ((count++) ? 'and' : 'where') + ` TB_REPAIR.detail like "%${detail}%" `

        queryString += ' order by   astCd'

        pool.query(queryString, function (error, result) {
            if (error)
                res.json({ success: false, error: 'ServerError', message: error })
            else
                res.json({ success: true, list: result })
        }
        )
    })

module.exports = router;