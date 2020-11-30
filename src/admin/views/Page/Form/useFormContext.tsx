import React from "react";
import { useContext } from "react";
import { Regeister, ValidationRule, ValidationRules } from "./Regeister";

export interface IForm{
  defaultValues?:any,
  values:any,
  errors?:any,
  status?:any,
  forceUpdate?:(newForm:IForm)=>void,
  registers:{[key:string]:Regeister},
}

export const defultForm = ()=>{
  return {
    defaultValues:{},
    values:{},
    errors:{},  
    registers:{}
  }
};

export const FormContext = React.createContext<IForm>(defultForm());

export function useFormContext():IForm&{
  setValue:(field:string, value:any)=>void,
  validate:(field:string)=>string|undefined|ValidationRule<boolean>,
  register:(field:string, rules:ValidationRules)=>void,
}{
  const formContext = useContext(FormContext);
  const setValue = (field:string, value:any) =>{
    formContext.values = formContext.values ? formContext.values : {};
    formContext.values[field] = value;
  }

  
  const validate =  (field:string):string|undefined | ValidationRule<boolean> =>{
    const errorMessage = formContext.registers[field]?.validate(formContext.values[field]);
    formContext.errors = formContext.errors ? formContext.errors : {};
    formContext.errors[field] = errorMessage;
    //formContext.forceUpdate && formContext.forceUpdate(formContext);
    return errorMessage;
  }

  const register = (field:string, rules:ValidationRules) => {
    formContext.registers[field] = new Regeister(rules);
  }
  return {...formContext, setValue, validate, register};
}

