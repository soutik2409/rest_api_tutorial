const express = require('express');
const mysql = require('mysql2');
const cors=require("cors");
const path=require("path");
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
//app.use(express.static(path.join(__dirname,'html_files')));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

const data = require(__dirname + '/server_id.json');
const student_data = mysql.createConnection(data);

student_data.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});

app.get('/',(req,res) => {
    res.sendFile(__dirname+"/html_files/index.html");
});

app.get('/api/students/StudentInfo', (req,res) => {
    res.sendFile(__dirname+"/html_files/StudentInfo.html");
});
app.get('/api/students/NewStudent', (req,res) => {
    res.sendFile(__dirname+"/html_files/NewStudent.html");
});

app.get('/api/students/UpdateStudentInfo', (req,res) => {
    res.sendFile(__dirname+"/html_files/UpdateStudentInfo.html");
});

app.get('/api/students/DeleteStudent', (req,res) => {
    res.sendFile(__dirname+"/html_files/DeleteStudent.html");
});

app.get('/api/students/StudentInfo/:RollNo', async (req,res) => {
    const qry='SELECT * FROM students WHERE RollNo = ?';
    student_data.query(qry, [req.params.RollNo], (err,result) => {
        if(err) {
            res.json({status : "Failure!!"});
        }
        else if(!result[0]){
            return res.json({status : "Student not found!!"});
        }
        else res.json(result[0]);
    });   
});

app.post('/api/students/NewStudent', (req, res) => {
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

app.post('/api/students/UpdateStudentInfo', (req, res) => {

    let a='',b='',c='',d='',e='';
    if(req.body.Name) a+=`Name = '${req.body.Name}'`;
    if(req.body.Address) b+=`Address = '${req.body.Address}'`;
    if(req.body.ContactNo) c+=`ContactNo = '${req.body.ContactNo}'`;

    if(a&&b) d+=',';
    if(b&&c) e+=',';
    const qry = 'UPDATE students SET '+a+d+b+e+c+` WHERE RollNo= '${req.body.RollNo}'`;
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

app.post('/api/students/DeleteStudent', (req,res) => {
    const qry = `DELETE FROM students WHERE RollNo = '${req.body.RollNo}'`;
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
