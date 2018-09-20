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
    .post(function (req, res) {
        const { usn } = req.body
        const { astCd, username, branchCd, divCd, dpmCd, a_location,  startDate, endDate, detail } = req.body.asm
        pool.getConnection(function (err, connection) {
            if (err)
                res.json({ success: false, error: 'ServerError', message: error })
            else {
                connection.query(
                    'select     count(astCd) \
                                as count \
                    from        TB_AST_ASM \
                    where	    astCd = ? \
                        and     startDate = ?',
                    [astCd, startDate],
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
                                username,
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
                                            'insert into    TB_AST_ASM (astCd, username, branchCd, divCd, dpmCd, a_location, \
                                                            startDate, endDate, detail, createdBy, modifiedBy) \
                                            values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                                            [astCd, username, branchCd, divCd, dpmCd, a_location, startDate, endDate, detail, usn, usn],
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
        const { astCd, username, branchCd, divCd, dpmCd, a_location, startDate, endDate, detail } = req.body.asm
        pool.getConnection(function (err, connection) {
            if (err)
                res.json({ success: false, error: 'ServerError', message: error })
            else {
                connection.query(
                    'select     count(username) \
                                            as count \
                                from        TB_USR \
                                where	    username = ?',
                    username,
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
                                'update     TB_AST_ASM \
                                set 		username = ?, branchCd = ?, divCd = ?, dpmCd = ?, \
                                            a_location = ?, endDate = ?, detail = ?, modifiedBy = ? \
                                where		astCd = ? \
                                    and     startDate = ?', 
                                [username, branchCd, divCd, dpmCd, a_location, endDate, detail, usn, astCd, startDate],
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

router.route('/:astCd&:startDate')
    .get(function (req, res) {
        pool.query(
            'select		astCd, username, \
                        TB_AST_ASM.branchCd, branchName, \
                        TB_AST_ASM.divCd, divName, \
                        TB_AST_ASM.dpmCd, dpmName, a_location, \
                        date_format(startDate, "%Y-%m-%d") as startDate, \
                        date_format(endDate, "%Y-%m-%d") as endDate, detail \
            from        TB_AST_ASM \
            inner join  TB_BRCH \
                on      TB_AST_ASM.branchCd = TB_BRCH.branchCd \
            inner join  TB_DIV \
                on      TB_AST_ASM.divCd = TB_DIV.divCd \
            inner join  TB_DPM \
                on      TB_AST_ASM.dpmCd = TB_DPM.dpmCd \
            where       astCd = ? \
                and     startDate = ?', 
            [req.params.astCd, req.params.startDate],
            function (error, result) {
                if (error)
                    res.json({ success: false, error: 'ServerError', message: error })
                else
                    res.json({ success: true, list: result })
            })
    })

router.route('/search')
    .post(function (req, res) {
        const { astCd, pgCd, pdCd, serialNumber, astDetail, username,
                branchCd, divCd, dpmCd, a_location, detail, status, showHistory } = req.body.asm
        let count = 0
        let queryString = 'select       TB_AST_ASM.astCd, serialNumber, username, branchName, divName, dpmName, \
                                        date_format(startDate, "%Y-%m-%d") as startDate \
	                        from		TB_AST_ASM \
                            inner join	TB_AST \
                                    on	TB_AST_ASM.astCd = TB_AST.astCd \
                            inner join 	TB_PRD \
                                    on	TB_AST.pdCd = TB_PRD.pdCd \
                            inner join 	TB_PDG \
                                    on	TB_PRD.pgCd = TB_PDG.pgCd \
                            inner join	TB_BRCH \
                                    on	TB_AST_ASM.branchCd = TB_BRCH.branchCd \
                            inner join	TB_DIV \
                                    on	TB_AST_ASM.divCd = TB_DIV.divCd \
                            inner join	TB_DPM \
                                    on	TB_AST_ASM.dpmCd = TB_DPM.dpmCd '
        if (astCd !== '')
            queryString += ((count++) ? 'and' : 'where') + ` TB_AST_ASM.astCd like "%${astCd}%" `
        if (pgCd !== '' && pgCd !== 'all')
            queryString += ((count++) ? 'and' : 'where') + ` TB_PRD.pgCd = "${pgCd}" `
        if (pdCd !== '' && pdCd !== 'all')
            queryString += ((count++) ? 'and' : 'where') + ` TB_AST.pdCd = "${pdCd}" `
        if (serialNumber !== '')
            queryString += ((count++) ? 'and' : 'where') + ` serialNumber like "%${serialNumber}%" `
        if (astDetail !== '')
            queryString += ((count++) ? 'and' : 'where') + ` TB_AST.detail like "%${astDetail}%" `
        if (username !== '')
            queryString += ((count++) ? 'and' : 'where') + ` username like "%${username}%" `

        if (branchCd !== '' && branchCd !== 'all')
            queryString += ((count++) ? 'and' : 'where') + ` TB_AST_ASM.branchCd = "${branchCd}" `
        if (divCd !== '' && divCd !== 'all')
            queryString += ((count++) ? 'and' : 'where') + ` TB_AST_ASM.divCd = "${divCd}" `
        if (dpmCd !== '' && dpmCd !== 'all')
            queryString += ((count++) ? 'and' : 'where') + ` TB_AST_ASM.dpmCd = "${dpmCd}" `

        if (a_location !== '')
            queryString += ((count++) ? 'and' : 'where') + ` a_location like "%${a_location}%" `
        if (detail !== '')
            queryString += ((count++) ? 'and' : 'where') + ` TB_AST_ASM.detail like "%${detail}%" `

        if (status !== '' && status !== 'all') {
            if (status === 'writeOff')
                queryString += ((count++) ? 'and' : 'where') + ` TB_AST.writeOffDate is not null `
            else if (status === 'repairing')
                queryString += ((count++) ? 'and' : 'where') + ` TB_AST_ASM.astCd  in  (select TB_REPAIR.astCd \
                                                                            from    TB_REPAIR \ 
                                                                            where   TB_REPAIR.astCd = TB_AST.astCd \
                                                                                and (TB_REPAIR.returnDate is null \
                                                                                or now() <= TB_REPAIR.returnDate)) `
            else if (status === 'active')
                queryString += ((count++) ? 'and' : 'where') + ` TB_AST_ASM.astCd  not in  (select TB_REPAIR.astCd \
                                                                            from    TB_REPAIR \ 
                                                                            where   TB_REPAIR.astCd = TB_AST.astCd \
                                                                                and (TB_REPAIR.returnDate is null \
                                                                                or now() <= TB_REPAIR.returnDate)) \
                                                                and TB_AST_ASM.astCd  in  (select TB_AST_ASM.astCd \
                                                                            from    TB_AST_ASM \
                                                                            where   TB_AST_ASM.astCd = TB_AST.astCd \
                                                                                and now() <= TB_AST_ASM.endDate) `
            else if (status === 'spare')
                queryString += ((count++) ? 'and' : 'where') + ` TB_AST.writeOffDate is null \
                                                                and TB_AST_ASM.astCd not in    (select TB_REPAIR.astCd \
                                                                                    from    TB_REPAIR \ 
                                                                                    where   TB_REPAIR.astCd = TB_AST.astCd \
                                                                                        and now() <= TB_REPAIR.returnDate) \
                                                                and TB_AST_ASM.astCd not in    (select TB_AST_ASM.astCd \
                                                                                    from    TB_AST_ASM \
                                                                                    where   TB_AST_ASM.astCd = TB_AST.astCd \
                                                                                        and now() <= TB_AST_ASM.endDate)`
        }

        if (!showHistory) 
            queryString += ((count++) ? 'and' : 'where') + ` now() <= endDate `
        
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