const mysql = require('mysql');
const express = require('express');
const app = express();
const path = require('path');
const session = require("express-session");
var cookieParser=require('cookie-parser');
const database = require("./database");
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var cookieSession = require("cookie-session");
// updated to 6.0.X
//const bodyParser = require('body-parser');  // Remove
//const mysql = require('mysql'); // Remove

require('dotenv').config();

app.set('trust proxy', 1)
app.use(
    cookieSession({
      name: "__session",
      keys: ["key1"],
        maxAge: 24 * 60 * 60 * 100,
        secure: true,
        httpOnly: true,
        sameSite: 'none'
    })
);
const pool = mysql.createPool({
    multipleStatements:true,
    host: 'localhost',
    user: 'root',
    password: "Adroitwriter68!",
    database: 'data_base',
  });
const expressHbs = require("express-handlebars");
const hbs = require("hbs");
const { authUser } = require('./basicAuth');

// устанавливаем настройки для файлов layout
app.engine("hbs", expressHbs.engine(
    {
        layoutsDir: "views/layouts", 
        defaultLayout: "main",
    
        extname: "hbs"
    }
))

app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");
  

// Parsing middleware
// Parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({extended: true})); // New

// Parse application/json
// app.use(bodyParser.json());
app.use(express.json()); // New

// Static Files
app.use(express.static(__dirname+'/public'));

// Templating engine
// app.engine('hbs', exphbs({ extname: '.hbs' })); // v5.3.4
// app.set('view engine', 'hbs'); // v5.3.4

// Update to 6.0.X
/*const handlebars = exphbs.create({ extname: '.hbs',});
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');
// Connection Pool
// You don't need the connection here as we have it in userController
// let connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME
// });
const routes = require('./server/routes/user');
app.use('/', routes);*/

app.use(session({
  secret : 'webslesson',
  resave : true,
  saveUninitialized : true
}));
app.use(bodyParser.json());
app.set("views", path.resolve(__dirname, "views"));

app.use(express.json());

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
//add the router

app.use(express.static(__dirname+'/public'));
app.get('/', function (req,res){
    res.sendFile(path.join(__dirname+'/public/hello.html'))

})
var role;

app.get('/home', function (req,res){
    res.sendFile(path.join(__dirname+'/public/home.html'))

})



app.get('/login', function (req,res){
    res.sendFile(path.join(__dirname+'/public/loginpage2.html'))
 
});
app.get('/profile', function (req,res){
    res.sendFile(path.join(__dirname+'/public/profile.html'))
});
app.get('/signup', function (req,res){
    res.sendFile(path.join(__dirname+'/public/signup.html'))
});
app.get('/signup-admin', function (req,res){

  res.sendFile(path.join(__dirname+'/public/signup-admin.html'))


});

app.get('/viewusers', function (req,res){
  if (role === 1)
    res.sendFile(path.join(__dirname+'/public/view.html'))
  else res.send("Access Denied")
});
app.get('/students',function (req,res){
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID' + connection.threadId);
   
        // User the connection
        connection.query('SELECT * from students', (err, rows) => {
          // When done with the connection, release it
          if (!err) {
            let removedUser = req.query.removed;
            if (role===1){
              res.render('partials/students-admin', {rows, removedUser});
            }
            else{
              res.render('partials/home', {rows, removedUser});
            }
            
          } else {
            console.log(err);
          }
          console.log('The data from user table: \n', rows);
        });
      });
})

app.post('/students',function (req,res){
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID' + connection.threadId);
        let searchTerm = req.body.search;
        // User the connection
        connection.query(`SELECT students.id, students.first_name,students.last_name,students.group_name,students.score, group_concat(electives.el_name) as el_name  FROM students, electives,records WHERE students.id = records.id and electives.el_id=records.el_id  and first_name = "${searchTerm}" or last_name = "${searchTerm}" group by students.id`, [searchTerm, searchTerm], (err, rows) => {
          if (!err) {
            res.render('partials/sorted', {rows});
          } else {
            console.log(err);
          }
          console.log('The data from user table: \n', rows);
        });
      });
})
app.get('/electives',function (req,res){
 
     pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('Connected as ID' + connection.threadId);
 
      // User the connection
      connection.query('SELECT el_name from electives', (err, rows) => {
        // When done with the connection, release it
        if (!err) {
          let removedUser = req.query.removed;
          if (role===1){
            res.render('partials/admin-electives', {rows, removedUser});
          }
          else{
               res.render('partials/user-elective', {rows, removedUser});
          }
       
        } else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      });
    });
 
})
app.get('/users',function (req,res){
  if (role === 1){
  pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('Connected as ID' + connection.threadId);
 
      // User the connection
      connection.query('SELECT * FROM user', (err, rows) => {
        // When done with the connection, release it
        if (!err) {
          let removedUser = req.query.removed;
          res.render('partials/users', {rows, removedUser});
        } else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      });
    });
  }
  else{
    res.send("Access Denied")
  }
})
app.post('/users',function (req,res){
  pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('Connected as ID' + connection.threadId);
      let searchi = req.body.polz_search;
      // User the connection
      connection.query(`SELECT * FROM user WHERE nickname = "${searchi}"`, [searchi], (err, rows) => {
        if (!err) {
          res.render('partials/polz-sorted', {rows});
        } else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      });
    });
})
app.get('/task',function (req,res){
  pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('Connected as ID' + connection.threadId);
 
      // User the connection
      connection.query('SELECT students.id, students.first_name,students.last_name,students.group_name,students.score, group_concat(electives.el_name) as el_name  FROM students, electives,records WHERE students.id = records.id and electives.el_id=records.el_id group by students.id', (err, rows) => {
        // When done with the connection, release it
        if (!err) {
          let removedUser = req.query.removed;
          res.render('partials/individual', {rows, removedUser});
        } else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      });
    });
})

app.post('/task',function (req,res){
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Connected as ID' + connection.threadId);
    let searchTask= req.body.searchtask;
    // User the connection
    connection.query(`SELECT  students.id, students.first_name,students.last_name,students.group_name,students.score, el_name FROM students, electives,records WHERE students.id = records.id and electives.el_id=records.el_id and el_name = "${searchTask}" ORDER BY score DESC LIMIT 15`,[searchTask], (err, rows) => {
      // When done with the connection, release it
      if (!err) {
        let removedUser = req.query.removed;

          res.render('partials/find', {rows, removedUser});

      } else {
        console.log(err);
      }
      console.log('The data from user table: \n', rows);
    });
  });
})

app.get('/records',function (req,res){
  pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('Connected as ID' + connection.threadId);
 
      // User the connection
      connection.query('SELECT records.info_id, students.id, students.first_name,students.last_name,students.group_name,students.score, electives.el_name  FROM students, electives,records WHERE students.id = records.id and electives.el_id=records.el_id ', (err, rows) => {
        // When done with the connection, release it
        if (!err) {
          let removedUser = req.query.removed;
          res.render('partials/records', {rows, removedUser});
        } else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      });
    });
})

app.get('/adduser',function (req,res){
  if (role === 1){
  res.render('partials/add-user');
  }
  else{
    res.send('Access Denied')
  }
    
})

app.get('/add_el',function (req,res){
  
  if (role === 1){
    res.render('partials/add-elective');
    }
    else{
      res.send('Access denied')
    }
})
app.get('/addrecord',function (req,res){
  if (role === 1)
  res.render('partials/add-record');
  else res.send("Access denied")
    
})
app.post('/add_el',function (req,res){
  pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('Connected as ID' + connection.threadId);
      const {el_name} = req.body;


      // User the connection
      connection.query('INSERT INTO electives SET el_name = ?', [el_name], (err, rows) => {
      if (!err) {
          res.render('partials/add-elective', {alert: 'Elective added successfully.'});
      } else {
          console.log(err);
      }
      console.log('The data from user table: \n', rows);
      });
  });
})
app.post('/adduser',function (req,res){
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID' + connection.threadId);
        const {first_name, last_name, group_name, score} = req.body;
      

        // User the connection
        connection.query('INSERT INTO students SET first_name = ?, last_name = ?, group_name = ?, score = ?', [first_name, last_name, group_name, score], (err, rows) => {
        if (!err) {
            res.render('partials/add-user', {alert: 'Student added successfully.'});
        } else {
            console.log(err);
        }
        console.log('The data from user table: \n', rows);
        });
    });
})
app.post('/addrecord',function (req,res){
  pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('Connected as ID' + connection.threadId);
      const {first_name, last_name, group_name, score,el_name} = req.body;
    

      // User the connection
      connection.query(`SELECT id into @st_id from students where first_name="${first_name}" and last_name="${last_name}" and group_name="${group_name}" and score="${score}";SELECT electives.el_id into @el_id from electives where electives.el_name = "${el_name}"; INSERT INTO records  SET records.id = @st_id,  records.el_id = @el_id `, [first_name, last_name, group_name, score,el_name], (err, rows) => {
      if (!err) {
          res.render('partials/add-record', {alert: 'Record added successfully.'});
      } else {
          console.log(err);
      }
      console.log('The data from user table: \n', rows);
      });
  });
})
app.get('/edituser/:id',function (req,res){
    if (role===1){
     pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID' + connection.threadId);
        // User the connection
        connection.query('SELECT * FROM students WHERE id =?', [req.params.id], (err, rows) => {
          if (!err) {
            res.render('partials/edit-user', {rows});
          } else {
            console.log(err);
          }
          console.log('The data from user table: \n', rows);
        });
      });
    }
    else{
      res.send("Access denied")
    }
 
   
  })
app.post('/edituser/:id',function (req,res){
  pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('Connected as ID' + connection.threadId);
      const {first_name,last_name,group_name,score} = req.body;
      // User the connection
      connection.query('UPDATE students SET first_name=?,last_name=?,group_name=?,score=? WHERE id = ? ', [first_name,last_name,group_name,score, req.params.id], (err, rows) => {
 
        if (!err) {
          // User the connection
          connection.query('SELECT * FROM students WHERE id = ?', [req.params.id], (err, rows) => {
            // When done with the connection, release it
 
            if (!err) {
              res.render('partials/edit-user', {rows, alert: `${first_name} has been updated.`});
            } else {z
              console.log(err);
            }
            console.log('The data from user table: \n', rows);
          });
        } else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      });
    });
})
app.get('/edit_el/:info_id',function (req,res){
  if (role===1){
  pool.getConnection((err, connection) => {
     if (err) throw err;
     console.log('Connected as ID' + connection.threadId);
     // User the connection
     connection.query(`SELECT records.info_id, students.first_name,students.last_name,students.group_name,students.score, electives.el_name  FROM students, electives,records WHERE students.id = records.id and electives.el_id=records.el_id and info_id=${req.params.info_id}`, [req.params.info_id], (err, rows) => {
       if (!err) {
         res.render('partials/edit-elective', {rows});
       } else {
         console.log(err);
       }
       console.log('The data from user table: \n', rows);
     });
   });
 }
 else{
  res.send("Access denied")
 }
}


)
app.post('/edit_el/:info_id',function (req,res){
  pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('Connected as ID' + connection.threadId);
      let first_name= req.body.first_name;
      let last_name = req.body.last_name;
      let group_name= req.body.group_name;
      let score= req.body.score;
      let el_name= req.body.el_name;
      console.log(el_name);
      console.log(req.params.info_id)
      // User the connection
      connection.query(`SELECT el_id into @el_id from electives where el_name = "${el_name}"; UPDATE students, records,electives SET students.first_name="${first_name}",students.last_name="${last_name}",students.group_name="${group_name}",students.score="${score}", records.el_id=@el_id  WHERE students.id = records.id and electives.el_id=records.el_id  and info_id = ${req.params.info_id} `, [first_name,last_name,group_name,score, el_name, req.params.info_id], (err, rows) => {
      
        if (!err) {
          // User the connection
          console.log(req.params.info_id)
          connection.query(`SELECT records.info_id, students.first_name,students.last_name,students.group_name,students.score, electives.el_name  FROM students, electives,records WHERE students.id = records.id and electives.el_id=records.el_id and info_id = ${req.params.info_id}`, [req.params.info_id], (err, rows) => {
            // When done with the connection, release it
 
            if (!err) {
              res.render('partials/edit-elective', {rows, alert: `${first_name} has been updated.`});
            } else {
              console.log(err);
            }
            console.log('The data from user table: \n', rows);
          });
        } else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      });
    });
})
app.get('/editpolz/:id',function (req,res){
  if (role === 1){
  pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('Connected as ID' + connection.threadId);
      // User the connection
      connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
        if (!err) {
          res.render('partials/edit-polz', {rows});
        } else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      });
    });
  }
})
app.post('/editpolz/:id',function (req,res){
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID' + connection.threadId);
        const {nickname,password,role} = req.body;
        // User the connection
        connection.query('UPDATE user SET nickname = ?, password = ?, role = ? WHERE id = ?', [nickname,password,role, req.params.id], (err, rows) => {
   
          if (!err) {
            // User the connection
            connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
              // When done with the connection, release it
   
              if (!err) {
                res.render('partials/edit-polz', {rows, alert: `${nickname} has been updated.`});
              } else {
                console.log(err);
              }
              console.log('The data from user table: \n', rows);
            });
          } else {
            console.log(err);
          }
          console.log('The data from user table: \n', rows);
        });
      });
})
app.get('/viewuser/:id',function (req,res){
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID' + connection.threadId);
        connection.query(`SELECT students.id, students.first_name,students.last_name,students.group_name,students.score, group_concat(electives.el_name) as el_name  FROM students, electives,records WHERE students.id = ${req.params.id} and students.id = records.id and electives.el_id=records.el_id  group by students.id `, [req.params.id], (err, rows) => {
          if (!err) {
            res.render('partials/view-user', {rows});
          } else {
            console.log(err);
          }
          console.log('The data from user table: \n', rows);
        });
      });
   
})
app.get('/viewdata/:id',function (req,res){
  pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('Connected as ID' + connection.threadId);
      connection.query(' SELECT students.id, students.first_name,students.last_name,students.group_name,students.score from students where students.id = ? ', [req.params.id], (err, rows) => {
        if (!err) {
          res.render('partials/viewdata', {rows});
        } else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      });
    });
 
})
app.get('/:id',function (req,res){
  if (role === 1){
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID' + connection.threadId);
        
    

         connection.query(`DELETE FROM students WHERE id = ${req.params.id}`, [req.params.id], (err, rows) => {
          console.log(req.params.id);
          if(!err) {
            res.redirect('/students');
         } else {
             console.log(err);
          }
          console.log('The data from user table: \n', rows);
    
        });
      });
    }
    else{
      res.send("Not allowed");
    }

})
app.get('/records/:info_id',function (req,res){
  if (role === 1){
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID' + connection.threadId);
        
    
         connection.query(`DELETE FROM records WHERE records.info_id = "${req.params.info_id}"`, [req.params.info_id], (err, rows) => {
          console.log(req.params.info_id);
          if(!err) {
            res.redirect('/records');
         } else {
             console.log(err);
          }
          console.log('The data from user table: \n', rows);
    
        });
      });
    }
    else{
      res.send("Not allowed");
    }

})
app.get('/polz/:id',function (req,res){
  if (role === 1){
  pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('Connected as ID' + connection.threadId);
      
  
       connection.query(`DELETE FROM user WHERE id = ${req.params.id}`, [req.params.id], (err, rows) => {
        console.log(req.params.id);
        if(!err) {
          res.redirect('/users');
       } else {
           console.log(err);
        }
        console.log('The data from user table: \n', rows);
  
      });
    });
  }
  else{
    res.send("Access denied");
  }
})

app.post('/login',function(request,response){
    const user_name = request.body.nickname;
    console.log(request.body.nickname);
    const user_password = request.body.password;
    console.log(user_password);
    if(user_name && user_password)
    {
        query = `
        SELECT * FROM users
        WHERE nickname = "${user_name}"
        `;
        
        database.query(query, function(error, data){

            if(data.length > 0)
            {
            
                    if(data[0].password)
                    {
                 
                      
                      bcrypt.compare(user_password,data[0].password,function(err,result){
                      if (result){
                        
        
                        response.redirect("/home");
                        role = data[0].role;
                        console.log(role)
                      


                      }
                     else{
                      response.end();
                     }

                      });
                    }
                  }
                })
              }
                        

                     
                   
                      
                        
                            

                        
                       
                       
    

});
app.post('/signup',function(request,response){
    const user_name = request.body.signupname;
    console.log(request.body.signupname);
    const user_password = request.body.signuppassword;
    console.log(user_password);
    
      if(user_name && user_password)
      {
        bcrypt.hash(user_password,4, function(err, hash) {
        database.query(`select nickname from users where nickname="${user_name}"`,[user_name],
        async(error,result)=>{
          if (error){
            confirm.log(error)
          }
          if (err) throw err;
          console.log(hash)
          if (result.length>0){
            response.send("Nickname is already taken");
          }
      
          query = `
          INSERT INTO users SET
          nickname = "${user_name}", password = "${hash}"
          `;
  
          database.query(query, function(error, data){
  
             
              response.redirect("/login");
  
                          })
                        });   
                       });
                        }


   
                });
                    
                
  app.post('/signup-admin', function (request,response){
  
    const user_name = request.body.signupadminname;
    console.log(request.body.signupadminname);
    const user_password = request.body.signupadminpassword;
    console.log(user_password);
    const user_role = request.body.signupadminrole;
    if(user_name && user_password)
    {
      bcrypt.hash(user_password,4, function(err, hash) {
      database.query(`select nickname from users where nickname="${user_name}"`,[user_name],
      async(error,result)=>{
        if (error){
          confirm.log(error)
        }
        if (err) throw err;
        console.log(hash)
        if (result.length>0){
          response.send("Nickname is already taken");
        }
    
        query = `
        INSERT INTO users SET
        nickname = "${user_name}", password = "${hash}", role = ${user_role}
        `;

        database.query(query, function(error, data){

           
            response.redirect("/login");

                        })
                      });   
                     });
                      }


 
              });
                  
app.post('/profile.html',function(request,response){
    if (typeof window !== 'undefined'){
        var elective = localStorage.getItem("elective");
      }
    var user = request.body.nickname;
    var firstname = request.body.firstname;
    console.log(request.body.firstname);
    var secondname = request.body.secondname;
    console.log(secondname);
    var group = request.body.group;
    console.log(group);
    var score = request.body.score;
    console.log(score);

    
    query =
        `INSERT INTO profile SET
        first_name = "${firstname}", last_name = "${secondname}", group_name = "${group}", score = "${score}"`
        ;
      

        database.query(query, function(error, data){
            if (error){
                throw error; 
            }
            else{
                
            console.log("!");
            response.redirect("/home");

            }


                        })
                    
               
           
             });

                    


app.listen(process.env.port || 3000);


console.log('Running at Port 3000 url: http://localhost:3000/');
