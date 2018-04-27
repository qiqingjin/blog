import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchJSONIfNeeded } from 'actions';

class FetchJSON extends Component {
  constructor(props){
    super(props);
  }
  componentWillReceiveProps(props, nextProps){
    //debugger;
  }
  componentDidMount(){
    const { dispatch } = this.props;
  }

  render(){
    const { dispatch } = this.props;
    let input;

    return (
      <div>
        <input ref = {instance => {
          input = instance;
        }} type="text"/>
        <button onClick = {e => {
          input && dispatch(fetchJSONIfNeeded(input.value));
          input && (input.value = '');
        }} >fetch json</button>
      </div>
    )
  }
}

FetchJSON = connect()(FetchJSON);

export default FetchJSON;