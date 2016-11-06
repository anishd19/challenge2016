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
      },
      allAreas: []
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
        possDist: pD,
        allAreas: nP.allAreas
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
  setInclude: function() {
    let inValue = this.refs.area.value;
    console.log("entered:", inValue);
    if(this.state.allAreas.indexOf(inValue) > -1) {
      let dist = this.props.user;
      let infoData = this.state.infoData;
      infoData.include.push(inValue);
      console.log("include modified ", infoData.include);
      console.log("dist is :", dist);
      helper.permissionChecker(dist, inValue).then(() => {
        console.log("YES");
        this.props.errHandler("");
        this.props.errHandler("That's a valid addition");
        // this.setState({
        //   infoData: infoData
        // });
        // console.log(this.state.infoData);
        //this.forceUpdate();
      }, () => {
        console.log("NO");
        this.props.errHandler("You do not have Permission. It is case sensitive");
      });
    }else {
      console.log("check input");
      console.log(this.props.errHandler);
      this.props.errHandler("The area doesn't exist in our database. It is case sensitive");
    }
  },
  setExclude: function() {
    let inValue = this.refs.area.value;
    console.log("entered:", inValue);
    if(this.state.allAreas.indexOf(inValue) > -1) {
      let dist = this.props.user;
      let infoData = this.state.infoData;
      infoData.exclude.push(inValue);
      console.log("exclude modified ", infoData.exclude);
      console.log("dist is :", dist);
      helper.permissionChecker(dist, inValue).then(() => {
        console.log("YES");
        this.props.errHandler("");
        this.props.errHandler("That's a valid addition");
        // this.setState({
        //   infoData: infoData
        // });
        // console.log(this.state.infoData);
        //this.forceUpdate();
      }, () => {
        console.log("NO");
        this.props.errHandler("You do not have Permission. It is case sensitive");
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
      <div>
        <p>Select Distibutor</p>
        <select name="user" id="dist-select">
          {optionList}
        </select>
        <div id="foo">
          <input type="text" ref="area" name="area" />
          <button className="green" onClick={this.setInclude}>include</button>
          <button className="red" onClick={this.setExclude}>exclude</button>
        </div>
        <div>
          <InfoPanel infoData={this.state.infoData}></InfoPanel>
        </div>
        <div id="bar">
          <button>Submit</button>
          <button onClick={this.props.toggleForm}>Dicard</button>
        </div>
      </div>
    );
  }
});

module.exports = EditForm;
