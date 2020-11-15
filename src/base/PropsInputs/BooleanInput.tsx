import React from 'react';
import { FormControlLabel, Switch} from '@material-ui/core';
import { PropsInputProps } from './PropsEditorProps';

export default function BooleanInput(props:PropsInputProps){
  const {field, label, value, onChange} = props;
  const [inputValue, setInputValue] = React.useState(!!value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.checked
    setInputValue(newValue);
    onChange(field, newValue);
  };  

  return (
    <FormControlLabel
      control={
        <Switch
          checked={inputValue}
          onChange={handleChange}
          color="primary"
          size="small" 
        />
      }
      style={{margin:'2px'}}
      label={<span style={{fontSize:'0.9rem'}}>{label}</span>}
    />

  )
}