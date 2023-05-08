const database = require("./data-base.js")


const getUsers = (req, res) => {

   // ajoute une condition a mon get 
   let sql = "select * from users";
   const sqlValues = [];
   // ajoute la conditions que si la langue est définit 
  if (req.query.language != null) {
  sql += " where language = ?";
  sqlValues.push(req.query.language);
   // ajoute la conditions que si la city est définit 
  } else if (req.query.city != null) {
    sql += " where city = ?";
    sqlValues.push(req.query.city);
  }

  

  database
    .query(sql, sqlValues)
    .then(([users]) => {
      if(users.length === 0){
        res.status(200).send("tableau vide ma geule");
      } else
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getUsersById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from users where id = ?", [id])
    .then(([users]) => {
      if (users[0] != null) {
        res.json(users[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const postUser = (req, res) => {

  const { firstname, lastname, email, city, language } = req.body;


  database
    .query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      res.location(`/api/users/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the user et fait chier");
    });
};

const updateUsers = (req, res) => {
  const id = parseInt(req.params.id)
  const { firstname, lastname, email, city, language } = req.body;

  database
    .query(
      "UPDATE users SET firstname = ? , lastname = ? , email = ?, city = ?, language =?  WHERE id = ?",
      [firstname, lastname, email, city, language, id]
    )
    .then(([result]) => {
      res.location(`/api/users/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the users");
    });
};

const deleteUsers = (req, res) => {
  const id = parseInt(req.params.id)

  database
  .query("delete from users where id = ?", [id])
  .then(([result]) => {
    if (result.affectedRows === 0) {
      res.status(404).send("Not Found");
    } else {
      res.sendStatus(204);
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error deleting the movie");
  });
};

module.exports = {
    getUsers,
    getUsersById,
    postUser,
    updateUsers,
    deleteUsers
};
