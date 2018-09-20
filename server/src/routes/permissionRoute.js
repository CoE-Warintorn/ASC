const express = require('express');
const router = express.Router();

const pool = require('../connector');

router.route('/')
    .post(function (req, res) {
        const { usn } = req.body
        const { username, appCd } = req.body.pms
        pool.query(`insert into	TB_USR_PMS	(username, appCd, createdBy) \
                    values		(?, ?, ?)`, 
                    [username, appCd, usn], 
                    function (error, result) {
                        if (error)
                            res.json({ success: false, error: 'ServerError', message: error })
                        else
                            res.json({ success: true, list: result })
                    })
    })
    .delete(function (req, res) {
        const { usn } = req.body
        const { username, appCd } = req.body.pms
        pool.query(`delete from	TB_USR_PMS \
                    where		username	=	? \
                        and	    appCd		=	?`,
                    [username, appCd],
                    function (error, result) {
                        if (error)
                            res.json({ success: false, error })
                        else
                            res.json({ success: true, result });
                    })
    })

router.route('/search')
    .post(function (req, res) {
        const { empCode, username, appCd, status } = req.body.pms
        let count = 0
        let queryString = 'select		TB_USR.empCode, TB_USR.username, \
                                        TB_APP.appCd, TB_APP.appName, \
                                        (select	count(TB_USR_PMS.username) \
                                        from	TB_USR_PMS \
                                        where	TB_USR.username = TB_USR_PMS.username \
                                            and	TB_APP.appCd = TB_USR_PMS.appCd) as permission \
                            from		TB_USR, TB_APP '
        if (empCode !== '')
            queryString += ((count++) ? 'and' : 'where') + ` empCode like "%${empCode}%" `
        if (username !== '')
            queryString += ((count++) ? 'and' : 'where') + ` TB_USR.username like "%${username}%" `
        if (appCd !== '' && appCd !== 'all')
            queryString += ((count++) ? 'and' : 'where') + ` TB_APP.appCd = "${appCd}" `
        if (status !== '' && status !== 'all')
            if (status === 'on')
                queryString += ((count++) ? 'and' : 'where') + ` (select	count(TB_USR_PMS.username) \
                                                                    from	TB_USR_PMS \
                                                                    where	TB_USR.username = TB_USR_PMS.username \
                                                                        and	TB_APP.appCd = TB_USR_PMS.appCd) > 0 `
            else if (status === 'off')
                queryString += ((count++) ? 'and' : 'where') + ` (select	count(TB_USR_PMS.username) \
                                                                    from	TB_USR_PMS \
                                                                    where	TB_USR.username = TB_USR_PMS.username \
                                                                        and	TB_APP.appCd = TB_USR_PMS.appCd) <= 0 `

        queryString += ' order by   TB_USR.empCode, TB_USR.username,TB_APP.appCd '

        pool.query(queryString, function (error, result) {
            if (error)
                res.json({ success: false, error: 'ServerError', message: error })
            else
                res.json({ success: true, list: result })
        }
        )
    })

module.exports = router;