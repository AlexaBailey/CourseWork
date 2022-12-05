const mysql = require('mysql');
// Connection Pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: "Adroitwriter68!",
  database: 'data_base',
});
 exports.view = (req, res) => {
   pool.getConnection((err, connection) => {
     if (err) throw err;
     console.log('Connected as ID' + connection.threadId);

     // User the connection
     connection.query('SELECT * FROM profile', (err, rows) => {
       // When done with the connection, release it
       if (!err) {
         let removedUser = req.query.removed;
         res.render('partials/home', {rows, removedUser});
       } else {
         console.log(err);
       }
       console.log('The data from user table: \n', rows);
     });
   });
 }

// View Users


// Find User by Search
exports.find = (req, res) => {
   pool.getConnection((err, connection) => {
     if (err) throw err;
     console.log('Connected as ID' + connection.threadId);
     let searchTerm = req.body.search;
     // User the connection
     connection.query(`SELECT * FROM profile WHERE first_name = "${searchTerm}" OR last_name = "${searchTerm}"  `, [searchTerm,searchTerm,searchTerm], (err, rows) => {
       if (!err) {
         res.render('partials/home', {rows});
       } else {
         console.log(err);
       }
       console.log('The data from user table: \n', rows);
     });
   });
}
exports.potions = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Connected as ID' + connection.threadId);
    let searchTerm = req.body.search;
    // User the connection
    connection.query('SELECT * FROM profile WHERE  = 1', (err, rows) => {
      if (!err) {
        res.render('partials/home', {rows});
      } else {
        console.log(err);
      }
      console.log('The data from potions table: \n', rows);
    });
  });
}

exports.form = (req, res) => {
  res.render('partials/add-user');
}

// Add new user
exports.create = (req, res) => {
   pool.getConnection((err, connection) => {
     if (err) throw err;
     console.log('Connected as ID' + connection.threadId);
     const {first_name, last_name, group, score, potions, quidditch, numerology, astronomy, dda} = req.body;
     let searchTerm = req.body.search;

     // User the connection
     connection.query('INSERT INTO profile SET first_name = ?, last_name = ?, group_name = ?, score = ?, potions = ?, quidditch = ?, numerology = ?, astronomy = ?, dda = ?', [first_name, last_name, group, score, potions, quidditch, numerology, astronomy, dda], (err, rows) => {
       if (!err) {
         res.render('partials/add-user', {alert: 'User added successfully.'});
       } else {
         console.log(err);
       }
       console.log('The data from user table: \n', rows);
     });
   });
}


// Edit user
exports.edit = (req, res) => {
   pool.getConnection((err, connection) => {
     if (err) throw err;
     console.log('Connected as ID' + connection.threadId);
     // User the connection
     connection.query('SELECT * FROM profile WHERE id = ?', [req.params.id], (err, rows) => {
       if (!err) {
         res.render('partials/edit-user', {rows});
       } else {
         console.log(err);
       }
       console.log('The data from user table: \n', rows);
     });
   });
}


// Update User
exports.update = (req, res) => {
   pool.getConnection((err, connection) => {
     if (err) throw err;
     console.log('Connected as ID' + connection.threadId);
     const {first_name, last_name, group, score, potions, quidditch, numerology, astronomy, dda} = req.body;
     // User the connection
     connection.query('UPDATE profile SET first_name = ?, last_name = ?, group_name = ?, score = ?, potions = ?, quidditch = ?, numerology = ?, astronomy = ?, dda = ? WHERE id = ?', [first_name, last_name, group, score, potions, quidditch, numerology, astronomy, dda, req.params.id], (err, rows) => {

       if (!err) {
         // User the connection
         connection.query('SELECT * FROM profile WHERE id = ?', [req.params.id], (err, rows) => {
           // When done with the connection, release it

           if (!err) {
             res.render('partials/edit-user', {rows, alert: `${first_name} has been updated.`});
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
}

// Delete User
exports.delete = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Connected as ID' + connection.threadId);
    c

     connection.query('DELETE FROM profile WHERE id = ?', [req.params.id], (err, rows) => {
      console.log(req.params.id);
      if(!err) {
        res.redirect('/');
     } else {
         console.log(err);
      }
      console.log('The data from user table: \n', rows);

    });

    // Hide a record

    /*connection.query('UPDATE user SET status = ? WHERE id = ?', ['removed', req.params.id], (err, rows) => {
      connection.release()
      if (!err)
        res.redirect('/');
      else {
        console.log(err);
      }
      console.log('The data from beer table are: \n', rows);
    });*/
  });

}

// View Users
exports.viewall = (req, res) => {
   pool.getConnection((err, connection) => {
     if (err) throw err;
     console.log('Connected as ID' + connection.threadId);
     connection.query('SELECT * FROM profile WHERE id = ?', [req.params.id], (err, rows) => {
       if (!err) {
         res.render('partials/view-user', {rows});
       } else {
         console.log(err);
       }
       console.log('The data from user table: \n', rows);
     });
   });

}