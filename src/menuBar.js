import React from 'react';
import { Menu } from 'semantic-ui-react';
import './menuBar.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Link from '@mui/material/Link';

// import CssBaseline from "@mui/material/CssBaseline";
// import { ThemeProvider, createTheme } from "@mui/material/styles";

function MenuBar(props) {

  // const themeLight = createTheme({
  //   palette: {
  //     backgroundColor: {
  //       default: "#fff"
  //     }
  //   },
  //   autoComplete: {
  //     backgroundColor: {

  //     }
  //   }
  // });

  const options = [
    { "title": "Postgresql", "type": "Relational Database" }
  ]

  const handleItemClick = (e, { name }) => props.setActiveItem(name);
  const handleAutocompleteClick = (e, newValue) => props.setDb(newValue);

  console.log("MenuBar", props.activeItem)

  return (
    
    <div className="Menu_Styling">
      <Menu pointing secondary>
        <Menu.Item
          style={{ fontSize: '120%', color: 'white' }}
          name='Download From DB'
          active={props.activeItem === 'Download From DB'}
          onClick={handleItemClick}
        />
        <Menu.Item
          style={{ fontSize: '120%', color: 'white' }}
          name='Upload to DB'
          active={props.activeItem === 'Upload to DB'}
          onClick={handleItemClick}
        />
        {/* <Menu.Item
          style={{ fontSize: '130%', color: 'white' }}
          name='About Me'
          active={props.activeItem === 'friends'}
          onClick={handleItemClick}
        /> */}
        <Menu.Menu position='right'>
          <Menu.Item
            style={{ fontSize: '120%', color: 'white' }}
          >
            <Link href='https://github.com/AshRK1997/database_operator' target='_blank' underline="none" style={{ color: 'white' }}>Github Repo</Link>
          </Menu.Item>
          <Menu.Item>
            
            <Autocomplete
              value={props.db}
              id="grouped-demo"
              options={options}
              groupBy={(option) => option.type}
              getOptionLabel={(option) => option.title}
              sx={{ width: 200 }}
              renderInput={(params) => <TextField  {...params} size="small"/>}
              handleChange={handleAutocompleteClick}
            />
            
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </div>
    
  );
}

export default MenuBar;
