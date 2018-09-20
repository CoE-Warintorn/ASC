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
        const { pdName, pgCd, tradingType, tradingProvider,
            warrantyFrom, warrantyTo, specification, detail } = req.body.pd
        pool.query(
            'insert into    TB_PRD (pdName, pgCd, tradingType, tradingProvider, \
            warrantyFrom, warrantyTo, specification, detail, createdBy, modifiedBy) \
            values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [pdName, pgCd, tradingType, tradingProvider, warrantyFrom, warrantyTo, specification, detail, usn, usn],
            function (error, result) {
                if (error) {
                    res.json({ success: false, error: 'ServerError', message: error })
                    console.log(error)
                }
                else
                    res.json({ success: true, result });
            }
        )
    })
    .put(function (req, res) {
        const { usn } = req.body
        const { pdCd, pdName, pgCd, tradingType, tradingProvider,
            warrantyFrom, warrantyTo, specification, detail } = req.body.pd
        pool.query(
            'update     TB_PRD \
            set 		pdName = ?, pgCd = ?, tradingType = ?, tradingProvider = ?, \
                        warrantyFrom = ?, warrantyTo = ?, \
                        specification = ?, detail = ? , modifiedBy = ? \
            where		pdCd = ?', [pdName, pgCd, tradingType, tradingProvider, 
                                    warrantyFrom, warrantyTo, specification, detail, usn, pdCd],
            function (error, result) {
                if (error)
                    res.json({ success: false, error })
                else
                    res.json({ success: true })
            })
    })

router.route('/:pdCd')
    .get(function (req, res) {
        pool.query(
            'select		pdCd, pdName, TB_PRD.pgCd, pgName, \
                        tradingType, tradingProvider, \
                        specification, detail, \
                        date_format(warrantyFrom, "%Y-%m-%d") as warrantyFrom, \
                        date_format(warrantyTo, "%Y-%m-%d") as warrantyTo \
            from        TB_PRD \
            inner join  TB_PDG \
                on      TB_PRD.pgCd = TB_PDG.pgCd \
            where       pdCd = ?', req.params.pdCd,
            function (error, result) {
                if (error)
                    res.json({ success: false, error: 'ServerError', message: error })
                else
                    res.json({ success: true, list: result })
            })
    })

router.route('/search')
    .post(function (req, res) {
        const { pdCd, pdName, pgCd, tradingType, tradingProvider, inWarranty, spec, detail } = req.body.pd
        let count = 0
        let queryString =   'select     pdCd, pdName,	pgName, tradingType, tradingProvider, \
                                        date_format(warrantyFrom, "%Y-%m-%d") as warrantyFrom, \
                                        date_format(warrantyTo, "%Y-%m-%d") as warrantyTo \
	                        from	    TB_PRD \
                            inner join  TB_PDG \
                                on      TB_PRD.pgCd = TB_PDG.pgCd '
        
        if (pdCd !== '')
            queryString += ((count++) ? 'and' : 'where') + ` pdCd like "%${pdCd}%" `
        if (pdName !== '')
            queryString += ((count++) ? 'and' : 'where') + ` pdName like "%${pdName}%" `
        if (pgCd !== '' && pgCd !== 'all')
            queryString += ((count++) ? 'and' : 'where') + ` TB_PRD.pgCd = "${pgCd}" `
        if (tradingType !== '' && tradingType !== 'all')
            queryString += ((count++) ? 'and' : 'where') + ` tradingType = "${tradingType}" `
        if (tradingProvider !== '')
            queryString += ((count++) ? 'and' : 'where') + ` tradingProvider like "%${tradingProvider}%" `
        if (inWarranty !== '' && inWarranty !== 'all') {
            if (inWarranty === 'yes')
                queryString += ((count++) ? 'and' : 'where') + ` now() <= warrantyTo `
            else
                queryString += ((count++) ? 'and' : 'where') + ` now() > warrantyTo `
        }
        if (spec !== '')
            queryString += ((count++) ? 'and' : 'where') + ` specification like "%${spec}%" `
        if (detail !== '')
            queryString += ((count++) ? 'and' : 'where') + ` detail like "%${detail}%" `
  
        queryString += ' order by	pdName, pgName'

        pool.query( queryString, function (error, result) {
                if (error)
                    res.json({ success: false, error: 'ServerError', message: error })
                else
                    res.json({ success: true, list: result })
            }
        )
    })

module.exports = router;