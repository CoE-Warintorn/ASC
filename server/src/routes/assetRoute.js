const express = require('express');
const router = express.Router();

const pool = require('../connector');

router.route('/')
    .post(function (req, res) {
        const { usn } = req.body
        const { astCd, pdCd, serialNumber, detail } = req.body.ast
        pool.getConnection(function (err, connection) {
            if (err)
                res.json({ success: false, error: 'ServerError', message: error })
            else {
                connection.query(
                    'select     count(astCd) \
                                as count \
                    from        TB_AST \
                    where	    astCd = ?',
                    astCd,
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
                                'insert into    TB_AST (astCd, pdCd, serialNumber, detail, createdBy, modifiedBy) \
                                values(?, ?, ?, ?, ?, ?)', [astCd, pdCd, serialNumber, detail, usn, usn],
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
        const { astCd, pdCd, serialNumber, detail, writeOffDate, reason } = req.body.ast
        pool.query(
            'update     TB_AST \
            set 		pdCd = ?, serialNumber = ?, detail = ?, \
                        writeOffDate = ?, reason = ?, modifiedBy = ? \
            where		astCd = ?', [pdCd, serialNumber, detail, writeOffDate, reason, usn, astCd],
            function (error, result) {
                if (error)
                    res.json({ success: false, error })
                else
                    res.json({ success: true })
            })
    })

router.route('/:astCd')
    .get(function (req, res) {
        pool.query(
            'select		astCd, pdCd, serialNumber, detail, \
                        date_format(writeOffDate, "%Y-%m-%d") as writeOffDate, reason \
            from        TB_AST \
            where       astCd = ?', req.params.astCd,
            function (error, result) {
                if (error)
                    res.json({ success: false, error: 'ServerError', message: error })
                else
                    res.json({ success: true, list: result })
            })
    })

router.route('/search')
    .post(function (req, res) {
        const { astCd, pgCd, pdCd, serialNumber, status, detail } = req.body.ast
        let count = 0
        let queryString = 'select       astCd, pgName, pdName, serialNumber, TB_AST.detail, \
                                        date_format(writeOffDate, "%Y-%m-%d") as writeOffDate \
	                        from	    TB_AST \
                            inner join  TB_PRD \
                                on      TB_AST.pdCd = TB_PRD.pdCd \
                            inner join  TB_PDG \
                                on      TB_PRD.pgCd = TB_PDG.pgCd '

        if (astCd !== '')
            queryString += ((count++) ? 'and' : 'where') + ` astCd like "%${astCd}%" `
        if (pgCd !== '' && pgCd !== 'all')
            queryString += ((count++) ? 'and' : 'where') + ` TB_PRD.pgCd = "${pgCd}" `
        if (pdCd !== '' && pdCd !== 'all')
            queryString += ((count++) ? 'and' : 'where') + ` TB_PRD.pdCd = "${pdCd}" `
        if (serialNumber !== '')
            queryString += ((count++) ? 'and' : 'where') + ` serialNumber = "${serialNumber}" `
        if (status !== '' && status !== 'all') {
            if (status === 'writeOff')
                queryString += ((count++) ? 'and' : 'where') + ` writeOffDate is not null `
            else if (status === 'repairing')
                queryString += ((count++) ? 'and' : 'where') + ` astCd  in  (select TB_REPAIR.astCd \
                                                                            from    TB_REPAIR \ 
                                                                            where   TB_REPAIR.astCd = TB_AST.astCd \
                                                                                and (TB_REPAIR.returnDate is null \
                                                                                or now() <= TB_REPAIR.returnDate)) `
            else if (status === 'active')
                queryString += ((count++) ? 'and' : 'where') + ` astCd  not in  (select TB_REPAIR.astCd \
                                                                            from    TB_REPAIR \ 
                                                                            where   TB_REPAIR.astCd = TB_AST.astCd \
                                                                                and (TB_REPAIR.returnDate is null \
                                                                                or now() <= TB_REPAIR.returnDate)) \
                                                                and astCd  in  (select TB_AST_ASM.astCd \
                                                                            from    TB_AST_ASM \
                                                                            where   TB_AST_ASM.astCd = TB_AST.astCd \
                                                                                and now() <= TB_AST_ASM.endDate) `
            else if (status === 'spare')
                queryString += ((count++) ? 'and' : 'where') + ` writeOffDate is null \
                                                                and astCd not in    (select TB_REPAIR.astCd \
                                                                                    from    TB_REPAIR \ 
                                                                                    where   TB_REPAIR.astCd = TB_AST.astCd \
                                                                                        and now() <= TB_REPAIR.returnDate) \
                                                                and astCd not in    (select TB_AST_ASM.astCd \
                                                                                    from    TB_AST_ASM \
                                                                                    where   TB_AST_ASM.astCd = TB_AST.astCd \
                                                                                        and now() <= TB_AST_ASM.endDate)`
        }
        if (detail !== '')
            queryString += ((count++) ? 'and' : 'where') + ` TB_AST.detail like "%${detail}%" `

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