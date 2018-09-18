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
        const { username, empCode, firstName, lastName, 
                branchCd, divCd, dpmCd, intercom, phone, email, active  } = req.body.user
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
                        else if (result[0].count > 0) {
                            connection.release();
                            res.json({ success: false, error: 'Exist' });
                        }
                        else
                            connection.query(
                                'insert into    TB_USR (username, empCode, firstName, lastName, \
                                                        branchCd, divCd, dpmCd, intercom, phone, \
                                                        email, active, createdBy, modifiedBy) \
                                values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                                [username, empCode, firstName, lastName, branchCd, divCd, dpmCd, 
                                intercom, phone, email, active, usn, usn],
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
        const { username, empCode, firstName, lastName,
            branchCd, divCd, dpmCd, intercom, phone, email, active } = req.body.user
        pool.query(
            'update     TB_USR \
            set 		empCode = ?, firstName = ?, lastName = ?, branchCd = ?, divCd = ? , dpmCd = ?, \
                        intercom = ?, phone = ?, email = ?, active = ?, modifiedBy = ? \
            where		username = ?', 
            [empCode, firstName, lastName, branchCd, divCd, dpmCd, intercom, phone, email, active, usn, username],
            function (error, result) {
                if (error)
                    res.json({ success: false, error })
                else
                    res.json({ success: true })
            })
    })

router.route('/:username')
    .get(function (req, res) {
        pool.query(
            'select     username, empCode, firstName, lastName, \
                        TB_USR.branchCd, branchName, \
                        TB_USR.divCd, divName, \
                        TB_USR.dpmCd, dpmName, \
                        intercom, phone, email, active \
            from	    TB_USR \
            inner join  TB_BRCH \
                on      TB_USR.branchCd = TB_BRCH.branchCd \
            inner join  TB_DPM \
                on      TB_USR.dpmCd = TB_DPM.dpmCd \
            inner join  TB_DIV \
                on      TB_USR.divCd = TB_DIV.divCd \
            where       username = ?', req.params.username,
            function (error, result) {
                if (error)
                    res.json({ success: false, error: 'ServerError', message: error })
                else
                    res.json({ success: true, list: result })
            })
    })

router.route('/search')
    .post(function (req, res) {
        const { username, empCode, firstName, lastName,
                branchCd, divCd, dpmCd, intercom, phone, email, active } = req.body.user
        let count = 0
        let queryString = 'select       username, empCode, branchName, dpmName, divName, active \
	                        from	    TB_USR \
                            inner join  TB_BRCH \
                                on      TB_USR.branchCd = TB_BRCH.branchCd \
                            inner join  TB_DIV \
                                on      TB_USR.divCd = TB_DIV.divCd \
                            inner join  TB_DPM \
                                on      TB_USR.dpmCd = TB_DPM.dpmCd '
                            
        if (username !== '')
            queryString += ((count++) ? 'and' : 'where') + ` username like "%${username}%" `
        if (empCode !== '')
            queryString += ((count++) ? 'and' : 'where') + ` empCode like "%${empCode}%" `
        if (firstName !== '')
            queryString += ((count++) ? 'and' : 'where') + ` firstName like "%${firstName}%" `
        if (lastName !== '')
            queryString += ((count++) ? 'and' : 'where') + ` lastName like "%${lastName}%" `
        if (branchCd !== '' && branchCd !== 'all')
            queryString += ((count++) ? 'and' : 'where') + ` TB_USR.branchCd = "${branchCd}" `
        if (divCd !== '' && divCd !== 'all')
            queryString += ((count++) ? 'and' : 'where') + ` TB_USR.divCd = "${divCd}" `
        if (dpmCd !== '' && dpmCd !== 'all')
            queryString += ((count++) ? 'and' : 'where') + ` TB_USR.dpmCd = "${dpmCd}" `
        if (phone !== '')
            queryString += ((count++) ? 'and' : 'where') + ` phone like "%${phone}%" `
        if (intercom !== '')
            queryString += ((count++) ? 'and' : 'where') + ` intercom like "%${intercom}%" `
        if (email !== '')
            queryString += ((count++) ? 'and' : 'where') + ` email like "%${email}%" `
        if (active !== '' && active !== 'all')
            queryString += ((count++) ? 'and' : 'where') + ` active = "${active}" `

        queryString += ' order by   username'

        pool.query(queryString, function (error, result) {
            if (error)
                res.json({ success: false, error: 'ServerError', message: error })
            else
                res.json({ success: true, list: result })
        }
        )
    })

module.exports = router;