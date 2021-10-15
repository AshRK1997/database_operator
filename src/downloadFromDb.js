import React, {useState} from 'react';
import './downloadFromDb.css';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSVLink } from "react-csv";
const Json2csvParser = require("json2csv").Parser;


var pg = require('pg');

// import CssBaseline from "@mui/material/CssBaseline";
// import { ThemeProvider, createTheme } from "@mui/material/styles";

function getQueryData(connString, query, setCsv, setError, setLoadig) {
    try{
    
    var client = new pg.Client(connString);
	client.connect(function (err) {
	  if (err) {
	    return console.error('could not connect to postgres', err);
	  }
	  console.log("query started")
	  //query 1: for downloading account history table - SELECT "tenantId", FORMAT('"%s', "Id"), "colName", "eventName", "oldValue", "newValue", to_char("eventTime"::timestamp, 'DD-MM-YYYY') FROM "cdp"."accounthistory" Where "tenantId"='9ac08989-b7f1-59d8-a29e-2b938c1a2c31' order by "eventTime" DESC
	  
	  client.query(`${query}`, function (err, res) {
	    if (err) {
	      return console.error('error running query', err);
	    }
	    try {
	      const jsonData = JSON.parse(JSON.stringify(res.rows));
	      console.log("jsonData", jsonData[0]);
	
	      const json2csvParser = new Json2csvParser({ header: true });
	      const csv = json2csvParser.parse(jsonData);
        setCsv(csv);
        setError(false);
	      
	    } catch (err) {
        setCsv(err);
        setError(true);
	      console.log(err)
          
	    }
	    client.end();
	    console.log("client closed")
        
	  });
	});
  setLoadig(false)
} catch (e) {
  setLoadig(false)
}
}

function DownloadDb(props) {
    const [dbvalue, setdbValue] = useState('');
    const [sqlQuery, setsqlQuery] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [csv, setCsv] = useState('');
    const [error, setError] = useState(false);

    const handleChangeDbString = (event) => {
        setdbValue(event.target.value);
      };
  
      const handleChangeSqlQuery = (event) => {
        setsqlQuery(event.target.value);
      };

      const handleDownloadCSV = () => {
        if (!(dbvalue || '').trim() && !(sqlQuery || '').trim().toLowerCase().includes('select')){
          toast.error('Please enter both the db connection url and the query or your query is wrong', {
            position: "bottom-left",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            });
        }
        setLoading(true);
        getQueryData(dbvalue, sqlQuery, setCsv, setError, setLoading);
      };

  return (
    
    <div className="download_db">
      {isLoading? <Backdrop
        sx={{ color: '#fff', zIndex:1000 }}
        open={isLoading} 
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" /> Loading...
      </Backdrop>   :
      <Stack spacing={2} direction="column">
      <TextField
          id="dbConfig-textarea"
          label="Db connection String"
          placeholder="postgres://YourUserName:YourPassword@localhost:5432/YourDatabase"
          multiline
          value={dbvalue}
          onChange={handleChangeDbString}
          maxRows={3}
          style={{width: "100%"}}
        />

        <TextField
          id="sql-textarea"
          label="SQL Query"
          placeholder="Please Enter the Query you want to run on the Database"
          multiline
          
          value={sqlQuery}
          onChange={handleChangeSqlQuery}
          maxRows={3}
          style={{width: "100%"}}
        />
      <Stack spacing={2} direction="row">
      <Button variant="contained" onClick={handleDownloadCSV}>Download CSV</Button>
      <Button variant="contained" onClick={() => {
            alert('clicked 2');
        }}>Preview</Button>

<CSVLink
  data={csv}
  onClick={handleDownloadCSV}
>
Download CSV
</CSVLink>
      
    </Stack>
    </Stack>
}
    </div>
    
  );
}

export default DownloadDb;
