import * as React from 'react';
import {TextField} from '@mui/material';
import {Autocomplete} from '@mui/material';


function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (typeof list[i] === 'object' && list[i]?.db_name === obj?.db_name && list[i]?.value === obj?.value ) {
            return true;
        }
    }

    return false;
}

export default function AutoSuggest(props) {
    
  let list_of_suggestions = JSON.parse(localStorage.getItem(props.localStorageKey)) || []

  console.log("Autosuggest list of suggestions", list_of_suggestions)
    
  React.useEffect(() => {
    
    if (props?.db_name && props?.localStorageKey && props?.previewHit){
        
        console.log("AutoSuggest input", props?.db_name, props?.localStorageKey, props?.previewHit)

        let temp_list_of_sugg = JSON.parse(localStorage.getItem(props.localStorageKey))

        console.log("AutoSuggest temp_list_of_sugg", temp_list_of_sugg)
        
        if (!Array.isArray(temp_list_of_sugg) || temp_list_of_sugg?.length <= 0) {
            temp_list_of_sugg = []
        }

        if(props.saveSuggestion && props.value && !containsObject({"db_name": props?.db_name, "value": props.value}, temp_list_of_sugg)) {
            temp_list_of_sugg.push({"db_name": props?.db_name, "value": props.value})
            localStorage.setItem(props.localStorageKey, JSON.stringify(temp_list_of_sugg));
            list_of_suggestions.push({"db_name": props?.db_name, "value": props.value})
        }
    }

  }, [props?.previewHit, props.localStorageKey, props?.db_name])

  React.useEffect(() => {
    
    if (!props.saveSuggestion){
        
        localStorage.removeItem(props.localStorageKey)
    }

  }, [props.saveSuggestion])



  return (
    
      
      <Autocomplete
        freeSolo
        
        disableClearable
        inputValue={props?.value || ""}
        value={props?.value || ""}
        onInputChange={(event, newInputValue) => {
          props.onChange(newInputValue);
        }}
        options={list_of_suggestions.map((option) => option?.value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={props?.label}
            placeholder={props?.placeholder}
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
      />

    
  );
}
