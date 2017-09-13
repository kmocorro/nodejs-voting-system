var bodyParser = require('body-parser');
var mysql = require('mysql');
var Promise = require('promise');

module.exports = function (app){

    let poolLocal = mysql.createPool({
        connectionLimit:    100,
        host    :           'localhost',
        user    :           'root',
        password:           '2qhls34r',
        database:           'dbvote'
    }); 

    //  look for http request, parse out json from http request
    app.use(bodyParser.json());
    //  make sure that this api can handle url requests
    app.use(bodyParser.urlencoded({ extended: true }));

    //  login validation
    app.post('/login/validate', function(req, res){

        poolLocal.getConnection(function(err, connection){

                if(req.body.employee_id){

                    connection.query({
                        sql: 'SELECT IF(employee_id IS NULL,0,employee_id) AS employee_id, IF(lastname IS NULL,0,lastname) AS lastname FROM tbl_employee_details WHERE lastname=?',
                        values: [req.body.lastname]
                    },  function(err, results, fields){

                        let obj = [];

                            for(let i=0; i < results.length; i++){
                                obj.push({
                                    employee_id: results[i].employee_id,
                                    lastname: results[i].lastname
                                });
                            }
                        
                            if (obj.length > 0){

                                if(obj[0].employee_id==req.body.employee_id){
                                    req.session.employee_id = req.body.employee_id;
                                    res.send('ok');
                                }else{
                                    res.send('Id number or Lastname does not exist');
                                }
                                
                            } else {
                                res.send('Id number or Lastname does not exist');
                            }
        
                    });
        
                } else {

                    console.log('error! '+req.body.employee_id);
        
                }
            
        });

    });

    app.post('/vote/validate', function(req, res){

        poolLocal.getConnection(function(err, connection){

                if(req.body.employee_id){

                    connection.query({
                        sql: 'SELECT IF(employee_id IS NULL,0,employee_id) AS employee_id, IF(poster_id IS NULL,0,poster_id) AS poster_id, IF(vote_value IS NULL, 0, vote_value) AS vote_value FROM tbl_vote_values WHERE employee_id=?',
                        values: [req.body.employee_id]
                    },  function(err, results, fields){

                        let obj = [];

                            for(let i=0; i < results.length; i++){
                                obj.push({
                                    employee_id: results[i].employee_id,
                                    poster_id: results[i].poster_id,
                                    vote_value: results[i].vote_value
                                });
                            }
                        
                            if (obj.length > 0){

                                if(obj[0].poster_id=='0'){
                                    connection.query({
                                        sql: 'UPDATE tbl_vote_values SET poster_id =?, vote_value = 1 WHERE employee_id = ?',
                                        values: [req.body.poster_id, req.body.employee_id]
                                    },  function(err, results, fields){
                                        console.log(req.body.employee_id + 'has voted ' + req.body.poster_id +' !');
                                    });
                                    res.send('ok');
                                }else{
                                    res.send('Sorry, ' + obj[0].employee_id + ' has already voted');
                                }
                                
                            } else {
                                res.send('Id number does not exist');
                            }
        
                    });
        
                } else {

                    console.log('error! '+req.body.employee_id);
        
                }
            
        });

    });
    
    app.get('/home', checkAuth, function(req, res){
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('home');
    });
    app.get('/mechanics', checkAuth, function(req, res){
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('mechanics');
    });
    app.get('/vote', checkAuth, function(req, res){
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('vote');
    });
    
    app.get('/logout', function (req, res) {
        delete req.session.employee_id;
        res.redirect('/');
      });  


    function checkAuth(req, res, next) {
        if (!req.session.employee_id) {
          res.render('authfail');
        } else {
          next();
        }
      }

}