var React = require('react');
var Autocomplete = require('react-autocomplete');
var helper = require('../helper.js');

var PermissionChecker = React.createClass({
  getInitialState: function() {
    return{
      subDist:["distributor1", "distributor2", "distributor3"],
      selectedDist: "distributor1",
      output: "",
      allAreas:[]
    };
  },
  componentWillMount: function() {
  },
  componentWillReceiveProps: function(nP) {
    //console.log("at componentWillReceiveProps");
    this.setState({
      subDist: nP.subDist,
      allAreas: nP.allAreas
    });
  },
  getOptionList: function() {
    let subDist = this.state.subDist;
    let optionList = [];
    subDist.forEach(function(name, i) {
      optionList.push(
        <option key={i} value={name}>{name}</option>
      );
    });
    return optionList;
  },
  render: function() {
    let optionList = this.getOptionList();
    return(
      <div id="permission-checker">
        <h4>Permission Checker</h4>
        <select name="user" id="per-dist-select">
          {optionList}
        </select>
        <input />
        <button>OK</button>
        <div><h2>YES</h2></div>
      </div>
    )
  }
});

module.exports = PermissionChecker;
