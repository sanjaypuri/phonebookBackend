const express = require('express');
require('dotenv').config();
const cors = require('cors');
const conn = require('./connection');
const bodyParser = require('body-parser');

const port = parseInt(process.env.PORT) || 5000;

const app = express();
app.use(express.json());

app.use(cors(
  {
    origin:["http://localhost:3000", "https://phonebookfrontend.vercel.app"],
    methods:["GET", "POST", "DELETE"],
    credentials: true
  }
));

app.use(express.static('./build'));

app.get('/api/home', (req, res, next) => {
  const sql = "SELECT * FROM phonebook";
  try {
    conn.query(sql, (err, result) => {
      if (err) {
        return res.json({ success: false, error: "Error reading data from phonebook" });
      }
      if (result.length == 0) {
        return res.json({ success: false, error: "No reords found in phonebook" });
      }
      return res.json({ success: true, message: "Data retrived from phonebook successfully", data: result });
    });
  } catch (err) {
    return req.json({ success: false, error: "database error" });
  };

});

app.post('/api/new', (req, res) => {
  const data = req.body;
  const sql = "INSERT INTO phonebook SET ?";
  try {
    conn.query(sql, data, (err, result) => {
      if (err) {
        return res.json({ success: false, error: "Error inserting record in Phonebook" });
      }
      return res.json({ success: true, message: "Record inserted successfully in Phonebook", data: "" });
    });
  } catch (err) {
    return res.json({ success: false, error: "database error" })
  };
});

app.delete('/api/delete/:id', (req, res) => {
  const sql = 'DELETE FROM phonebook where id = ' + req.params.id;
  try {
    conn.query(sql, (err, result) => {
      if (err) {
        return res.json({ success: false, error: "Error deleting Phonebook entry" });
      }
      return res.json({ success: true, message: "Record deleted successfully from Phonebook", data: "" });
    });
  } catch (err) {
    return res.json({ success: false, error: "Error deleting record from Phonebook" })
  };
});

app.put('/api/update/:id', (req, res) => {
  const data = [
    req.body.name,
    req.body.phone,
    req.body.email,
    req.body.city,
    req.params.id
  ];
  const sql = "UPDATE phonebook SET name = ?, phone = ?, email = ?, city = ? WHERE id = ?"
  try {
    conn.query(sql, data, (err, result) => {
      if (err) {
        return res.json({ success: false, error: "Error updating Phonebook" });
      }
      return res.json({ success: true, message: "Phonebook updated successfully", data: "" });
    });
  } catch (err) {
    return res.json({ success: false, error: "Error deleting record from Phonebook" })
  };
});

app.listen( port, () => {
  console.log(`Listning on port ${port}` );
});