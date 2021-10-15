import Computer_Server from './pics/Computer_Server.svg';
import './App.css';
import React, {useState} from 'react';
import MenuBar from './menuBar'
import DownloadDb from './downloadFromDb'
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ConstructionIcon from '@mui/icons-material/Construction';

function App() {
  const [activeItem, setActiveItem] = useState("Download From DB");
  const [db, setDb] = useState({ "title": "Postgresql", "type": "Relational Database" });

  return (
    <div className="App">
      <header className="background">
        
        <MenuBar setActiveItem={setActiveItem} activeItem={activeItem} db={db} setDb={setDb}/>
        <div className="body_paper">
        {
          activeItem === "Download From DB"? <Paper style={{width: "96vw", height: "82vh", backgroundColor: "rgb(207, 244, 255)"}} elevation={3} ><DownloadDb db={db}/></Paper>: <Paper style={{width: "96vw", height: "82vh", backgroundColor: "rgb(207, 244, 255)"}} elevation={3} ><img style={{height: "90%", width: "90%"}} src={Computer_Server} alt="Work In Progress" title="Work In Progress"/><Typography variant='h5'>Under Construction...<ConstructionIcon/></Typography></Paper>
        }
        </div>
      </header>
    </div>
  );
}

export default App;
