const port = 4000;
const express = require('express');
const router = express.Router();
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');

const mysql = require('mysql');
const pool = mysql.createPool({
    host    : 'localhost',
    user    : 'newuser',
    password: '1234',
    database: 'db_asc'
});

const activeDirectory = require('activedirectory2');
const config = {
    url: 'ldap://192.168.77.2:389',
    baseDN: 'OU=IT,OU=FAC-HDY,OU=Factory,OU=Haadthip,DC=haadthip,DC=com'
}
const ad = new activeDirectory(config);

const salt = 'secret';
const jwt = require('jsonwebtoken');
function exportJwt(username) {
    const payload = { username }
    return jwt.sign(payload, salt, { expiresIn: '1m'}); 
}

router.route('/authenticate')
    .post(function (req, res) {
        var username = req.body.username
        var password = req.body.password
        pool.query(
            'select     count(username) \
                        as hasPermission \
            from		TB_USR_CTL \
            where		username = ? \
                and     now() <= endDate \
                and     adminInd = "y"',
            username,
            function (error, result) {
                if (error) 
                    res.json({ success: false, error: 'ServerError', message: error })
                else if (result[0].hasPermission > 0) {
                    // ad.authenticate(username, password, function (err, auth) {
                    //     if (err) 
                    //         res.json({ success: false, error: 'Incorrect' })
                    //     else if (!auth) 
                    //         res.json({ success: false, error: 'Incorrect' })
                    //     else 
                    //         res.json({ success: true, token: exportJwt(username) })
                    // })
                    // Test Only
                    if (password === '1234')
                        res.json({ success: true, token: exportJwt(username) })
                    // else
                    //     res.json({ success: false, error: 'Incorrect' })
                }
                else
                    res.json({ success: false, error: 'NoAuth' })
            }
        )
    })

function isAuthenticated(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token)
        jwt.verify(token, salt, function (err, decoded) {
            if (err) 
                return res.json({ success: false, error: 'TimeOut' })
            else
                next();
        });
    else 
        return res.json({ success: false, error: 'TimeOut' })
        
}

router.use('/admin/users', isAuthenticated, require('./routes/adminUserRoute'))
router.use('/productgroups', isAuthenticated, require('./routes/productGroupRoute'))
router.use('/applications', isAuthenticated, require('./routes/applicationRoute'))
router.use('/branches', isAuthenticated, require('./routes/branchRoute'))
router.use('/divisions', isAuthenticated, require('./routes/divisionRoute'))
router.use('/departments', isAuthenticated, require('./routes/departmentRoute'))

router.use('/products', isAuthenticated, require('./routes/productRoute'))
router.use('/assets', isAuthenticated, require('./routes/assetRoute'))
router.use('/users', isAuthenticated, require('./routes/userRoute'))

router.use('/asset_assignment', isAuthenticated, require('./routes/assetAssignmentRoute'))
router.use('/repair_history', isAuthenticated, require('./routes/repairHistoryRoute'))
router.use('/permission', isAuthenticated, require('./routes/permissionRoute'))

app.use(cors());
app.use('/api', bodyParser.json(), router);
app.listen(port, function () {
    console.log(`Server listening on http://localhost:${port}/api`)
})