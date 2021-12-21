const express = require('express');
const mysql = require('mysql2');
const cors=require("cors");
const path=require("path");
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname,'html_files')));

app.use(express.json());

const student_data = mysql.createConnection({
    host: 'localhost',
    user: 'SOUTIK',
    password: '123',
    database: 'rest_students'
});

student_data.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});

app.get('/',(req,res) => {
    res.sendFile(__dirname+"/html_files/index.html");
});

app.get('/api/students', (req,res) => {
    student_data.query('SELECT * FROM students', (err,result) => {
        if(err) throw err;
        res.json(result);
    });
});

app.get('/api/students/:roll', async (req,res) => {
    const qry='SELECT * FROM students WHERE RollNo = ?';
    student_data.query(qry, [req.params.roll], (err,result) => {
        if(err) {
            res.json({status : "Failure!!"});
        }
        else if(!result[0]){
            return res.json({status : "Student not found!!"});
        }
        else res.json(result[0]);
    });   
});

app.post('/api/students', (req, res) => {
    const student = {
        RollNo: req.body.RollNo,
        Name : req.body.Name,
        Address: req.body.Address,
        ContactNo: req.body.ContactNo
    };
    const qry = 'INSERT INTO students VALUES(?,?,?,?)';
    student_data.query(qry,Object.values(student),(err) =>{
        if (err){
            res.json({status : "Failed to add student", reason : err.code});
        }
        else{
            res.json({status : "Success", data: student});
        }
    });
});

app.put('/api/students/:roll', (req, res) => {

    let a='',b='',c='',d='',e='';
    if(req.body.Name) a+=`Name = '${req.body.Name}'`;
    if(req.body.Address) b+=`Address = '${req.body.Address}'`;
    if(req.body.ContactNo) c+=`ContactNo = '${req.body.ContactNo}'`;

    if(a&&b) d+=',';
    if(b&&c) e+=',';
    const qry = 'UPDATE students SET '+a+d+b+e+c+` WHERE RollNo= '${req.params.roll}'`;
    student_data.query(qry,(err,result) =>{
        if (err){
            res.json({status : "Failed to add student", reason : err.code});
        }
        else if(result.affectedRows==0){
            res.json({status : "Student not found!!"});
        }
        else{
            res.json({status : "Successfully modified"});
        }
    });
});

app.delete('/api/students/:roll', (req,res) => {
    const qry = `DELETE FROM students WHERE RollNo = '${req.params.roll}'`;
    student_data.query(qry,(err,result) =>{
        if (err){
            res.json({status : "Failed to delete student", reason : err.code});
        }
        else if(result.affectedRows==0){
            res.json({status : "Student not found!!"});
        }
        else{
            res.json({status : "Successfully deleted"});
        }
    });
});



const port = process.env.PORT || 8080;
app.listen(port,()=>{
    console.log(`listening on port ${port}...`);
})