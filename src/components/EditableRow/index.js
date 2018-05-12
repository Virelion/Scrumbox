import React, { Component } from 'react';
import InputField from './InputField';
import Select from './Select';
import CheckBox from './CheckBox';
import Helper from './../../Helper';
import './style.css';

export default class EditableRow extends Component {
    static propTypes = {}
    static defaultProps = {}
    
    createComponent(field,i){
        switch(field.type){
            case 'select': return <Select onRef={ref => this.registerRef(ref,i)} className="rowItem" fieldName={field.name} type={field.type} model={field.model} value={field.value} editable={field.editable && this.state.editMode} />;
            case 'text': return <InputField onRef={ref => this.registerRef(ref,i)} className="rowItem" fieldName={field.name} type={field.type} value={field.value} editable={field.editable && this.state.editMode} />; 
            case 'checkbox': return <CheckBox onRef={ref => this.registerRef(ref,i)} fieldName={field.name} type={field.type} value={field.value} editable={field.editable && this.state.editMode} />; 
            default: return undefined;
        }
    }
    
    registerRef(ref,i){
        this.setState((prevState)=>{
            prevState.refs.push(ref);
            return prevState;
        });
    }
    
    createComponents(){
        this.state.fields = [];
        this.props.fields.forEach((field,i)=>{
            this.state.fields.push(this.createComponent(field,i));
        });
    }
    
    constructor(props){
        super(props);
    }
    
    state = {
        editMode: false,
        fields: [],
        refs: []
    }

    getCurrentObj() {
        var obj = {};
        this.state.refs.forEach((ref)=>{
            var fieldVal = ref.getCurrentField();
            obj[fieldVal.name] = fieldVal.value;
        });
        return obj;
    }

    onChange(e) {
        this.setState({ editMode: !this.state.editMode },()=>{
            if(this.state.editMode === false){
               this.props.onConfirm(this.getCurrentObj());
            }
        });
    }

    render() {
        this.createComponents();
        return (<tr className={this.state.editMode ? "animation-toEditMode " : "record animation-green_flash"} key={this.props.key}>
        {this.state.fields.map((field,i)=>{
            return (<td key={i}>{field}</td>);
            })}
                
                <td><button className="rowButton input" onClick={this.onChange.bind(this)}>{this.state.editMode ? "Confirm": "Edit"}</button></td>        
                        
                </tr>
        
            );
        
    }
};