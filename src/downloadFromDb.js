import React, {useState, useEffect} from 'react';
import './downloadFromDb.css';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import '@inovua/reactdatagrid-enterprise/index.css';
import { Typography } from '@mui/material';


require('dotenv').config();

// const Json2csvParser = require("json2csv").Parser;


// import CssBaseline from "@mui/material/CssBaseline";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
const gridStyle = { minHeight: 550 }

const downloadBlob = (blob, fileName = 'db-data.csv') => {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.position = 'absolute';
  link.style.visibility = 'hidden';

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};

const SEPARATOR = ',';


const getQueryData=(connString, query)=> {
  
    console.log("getQueryData", process.env.REACT_APP_BACKEND_URL, connString, query)
    return axios.post(`${process.env.REACT_APP_BACKEND_URL}/get/db/data`, { connString, query });
  
}

const getColumnsFromJson=(csv)=> {
  try{
  if (Array.isArray(csv) & csv.length > 0) {
    let keys = Object.keys(csv[0]);
    let columnsList = [];

    for (let i=0; i < keys.length; i++) {
      let tempObj = {};

      tempObj.key = keys[i];
      tempObj.name = keys[i];
      tempObj.defaultVisible=true;
      tempObj.sortable=true;
      
      


      columnsList.push({...tempObj})
    }

    return columnsList;
  } else {
    return [];
  }
}catch(e){
  console.log(e)
  return [];
}

}

const filterValue=(csv)=> {
  try{
  if (Array.isArray(csv) & csv.length > 0) {
    let keys = Object.keys(csv[0]);
    let columnsList = [];

    for (let i=0; i < keys.length; i++) {
      let tempObj = {};

      tempObj.name = keys[i];
      tempObj.type = "string";
      tempObj.operator="contains";
      tempObj.value="";

      columnsList.push({...tempObj})
    }

    return columnsList;
  } else {
    return [];
  }
}catch(e){
  console.log(e)
  return [];
}

}

function DownloadDb(props) {
    const [dbvalue, setdbValue] = useState('');
    const [sqlQuery, setsqlQuery] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [csv, setCsv] = useState('');
    const [csvLoaded, setCsvLoaded] = useState(false);
    const [gridRef, setGridRef] = useState(null);
    const [fileName, setFileName] = useState('');

    const exportCSV = () => {
      const columns = gridRef.current.visibleColumns;
  
      const header = columns.map((c) => c.name).join(SEPARATOR);
      const rows = gridRef.current.data.map((data) => columns.map((c) => data[c.id]).join(SEPARATOR));
  
      const contents = [header].concat(rows).join('\n');
      const blob = new Blob([contents], { type: 'text/csv;charset=utf-8;' });
  
      downloadBlob(blob, ((fileName || 'db-data') + ".csv"));
    };

    useEffect(() => {
      console.log("useEffect", csv)
    }, [csv])

    const handleChangeDbString = (event) => {
        setdbValue(event.target.value);
      };
  
      const handleChangeSqlQuery = (event) => {
        setsqlQuery(event.target.value);
      };

      const handleChangeFileQuery = (event) => {
        setFileName(event.target.value);
      };

      const handleDownloadCSV = () => {
        console.log("handleDownloadCSV clicked")
        
        if (!(dbvalue || '').trim() || !(sqlQuery || '').trim().toLowerCase().includes('select')){
          console.log("handleDownloadCSV inside if")
          toast.error('Please enter both the db connection url and the query or your query is wrong', {
            position: "bottom-left",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            });
        } else {
          console.log("handleDownloadCSV inside else")
        setLoading(true);
        getQueryData(dbvalue, sqlQuery).then((result) => {
          if (result.data.success) {
            // const json2csvParser = new Json2csvParser({ header: true });
            // json2csvParser.parse()
            setCsv(result.data.data)
            setCsvLoaded(true)
          } else {
            toast.error('Could not retreive data due to this error: '+result.data.error, {
              position: "bottom-left",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: 0,
              });
              setCsvLoaded(false)
          }
          setLoading(false);
        }).catch((error)=> {
          toast.error('Could not retreive data due to this error: '+error, {
            position: "bottom-left",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            });
            console.log("handleDownloadCSV", error);
            setCsvLoaded(false);
            setLoading(false);
        })
        }
      };

  return (
    
    <div className="download_db">
      
      {isLoading? <Backdrop
        sx={{ color: '#fff', zIndex:1000 }}
        open={isLoading} 
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />&nbsp;&nbsp;&nbsp;&nbsp;Loading...
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
        <TextField
          id="file-text"
          label="File Name"
          placeholder="Please Enter the File Name you want use to export file without extension"
          
          
          value={fileName}
          onChange={handleChangeFileQuery}
          
          style={{width: "100%"}}
        />
      <Stack spacing={2} direction="row">
      <Button variant="contained" onClick={handleDownloadCSV}>Preview</Button>
      {csvLoaded? <Button variant="contained" onClick={exportCSV}>Export To CSV</Button>: <React.Fragment></React.Fragment>}
    </Stack>
    {csvLoaded? <div id="preview_grid">
    <Stack spacing={3} direction="column">
      <Typography variant="h5">Preview Grid</Typography>
      <ReactDataGrid
  // idProperty="id"
  handle={setGridRef}
  columns={getColumnsFromJson(csv)}
  dataSource={csv}
  style={gridStyle}
  pagination
  defaultGroupBy={[]}
  defaultLimit={50}
  defaultFilterValue={filterValue(csv)}
/></Stack>
</div>: <React.Fragment></React.Fragment>}
    </Stack>
}
<ToastContainer className="toast"/>
    </div>
    
  );
}

export default DownloadDb;
