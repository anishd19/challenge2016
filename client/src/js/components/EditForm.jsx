var React = require('react');
var InfoPanel = require('./InfoPanel.jsx');
var helper = require('../helper.js');

var EditForm = React.createClass({
  getInitialState: function() {
    return{
      possDist:["distributor1", "distributor2", "distributor3"],
      selectedDist: "distributor1",
      infoData: {
        name:"",
        include: [],
        exclude: []
      }
    };
  },
  componentWillReceiveProps: function(nP) {
    //console.log("at componentWillReceiveProps");
    let i = 0, pD = [];
    function foo() {
      return new Promise(function(resolve, reject) {
        helper.getSubDist(nP.user, (err, arr) => {
          if(err) console.error("error: ", err);
          pD = arr;
          if(++i === 1) resolve();
        }, true);
      });
    }
    foo().then(() => {
      this.setState({
        possDist: pD
      });
    })
  },
  componentDidMount: function() {
    var self = this;
    document.getElementById("dist-select").addEventListener('change',function(e) {
      self.setSelectedDist();
    });
    this.setSelectedDist();
    //console.log("at componentDidMount");
  },
  componentWillUpdate: function(nP, nS) {
    //console.log("at componentWillUpdate");
    if(document.getElementById("dist-select").value !== nS.selectedDist || this.state.infoData.name === "")
      this.setSelectedDist();
    if(!nS.possDist.length > 0)
      nS.selectedDist = "";
  },
  shouldComponentUpate: function(nP, nS) {
    //console.log("at shouldComponentUpate");
    return(this.state.selectedDist !== nS.selectedDist || this.state.infoData.name === "");
  },
  componentDidUpdate: function(pP, pS) {
    //console.log("at componentDidUpdate");
    if(document.getElementById("dist-select").value !== this.state.selectedDist){
      this.setSelectedDist();
    }
  },
  setSelectedDist: function() {
    let sD = document.getElementById("dist-select").value;
    let tsD = !!sD ? sD : this.state.subDist;
    helper.getInfoPanelData(tsD, (iD) => {
      this.setState({
        selectedDist: tsD,
        infoData: {
          name: iD.name,
          include: iD.include,
          exclude: iD.exclude
        }
      });
    });
  },
  getOptionList: function() {
    let possDist = this.state.possDist;
    let optionList = [];
    possDist.forEach(function(name, i) {
      optionList.push(
        <option key={i} value={name}>{name}</option>
      );
    });
    return optionList;
  },
  render: function() {
    let optionList = this.getOptionList();
    return(
      <div>
        <p>Select Distibutor</p>
        <select name="user" id="dist-select">
          {optionList}
        </select>
        <div id="foo">
          <input />
          <button className="green">include</button>
          <button className="red">exclude</button>
        </div>
        <div>
          <InfoPanel infoData={this.state.infoData}></InfoPanel>
        </div>
        <div id="foo">
          <button>Submit</button>
          <button onClick={this.props.toggleForm}>Dicard</button>
        </div>
      </div>
    );
  }
});

module.exports = EditForm;
