var React = require('react');
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
      allAreas: nP.allAreas,
      wellValue: "Result",
      wellColor: "darkblue",
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
  selectArea: function() {
    let inValue = this.refs.area.value;
    console.log("entered:", inValue);
    if(this.state.allAreas.indexOf(inValue) > -1) {
      let dist = this.refs.dist.value;
      console.log("dist is :", dist);
      helper.permissionChecker(dist, inValue).then(() => {
        console.log("YES");
        this.props.errHandler("");
        this.setState({
          wellValue: "YES",
          wellColor: "green",
        });
      }, () => {
        console.log("NO");
        this.setState({
          wellValue: "NO",
          wellColor: "darkred",
        });
      });
    }else {
      console.log("check input");
      console.log(this.props.errHandler);
      this.props.errHandler("The area doesn't exist in our database. It is case sensitive");
    }
  },
  render: function() {
    let optionList = this.getOptionList();
    return(
      <div id="permission-checker">
        <h4>Permission Checker</h4>
        <select ref="dist" name="dist" id="per-dist-select">
          {optionList}
        </select>
        <input type="text" ref="area" name="area" />
        <button onClick={this.selectArea}>OK</button>
        <div style={{
            backgroundColor: this.state.wellColor
          }}id="result-well"><h2>{this.state.wellValue}</h2></div>
      </div>
    )
  }
});

module.exports = PermissionChecker;

/*

<Autocomplete
  value={this.state.value}
  inputProps = {{name: "allAreas"}}
  items = {this.state.allAreas}
  getItemValue = {(item) => item}
  shouldItemRender={Autocomplete.matchStateToTerm}
  onChange={(event, value) => this.setState({ value })}
  onSelect={value => this.setState({ value })}
  renderItem={(item, isHighlighted) => (
    <div
      style={isHighlighted ? styles.highlightedItem : styles.item}
      key={this.state.allAreas.indexOf(item)}
    >{item}</div>
  )}
/>

*/
