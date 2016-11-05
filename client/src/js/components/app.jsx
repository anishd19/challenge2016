var React = require('react');
var EditForm = require('./EditForm.jsx');
var PermissionChecker = require('./PermissionChecker.jsx');
var SelfInfo = require('./SelfInfo.jsx');
var SubDistInfo = require('./SubDistInfo.jsx');
var helper = require('../helper.js');

var App = React.createClass({
  getInitialState: function() {
    return {
      user: "admin",
      subDist: ["distributor1", "distributor2", "distributor3"],
      allAreas: []
    }
  },
  componentWillMount: function() {
    helper.initiateDB();
    helper.loadDummyDB(() => {
      helper.viewDB("movies");
      this.forceUpdate();
    });
    helper.getAllAreas((arr) => {
      this.setState({
        allAreas: arr
      })
    });
  },
  componentWillReceiveProps: function(nP) {

  },
  selectMainUser: function() {
    let u = this.refs.user.value;
    helper.getSubDist(u, (err, arr) => {
      if(err) console.error("error: ", err);
      this.setState({
        user: u,
        subDist: arr
      });
    });
  },
  render: function() {
    return (
      <div>
        <div id="edit-form">
          <EditForm toggleForm={toggleForm} user={this.state.user}></EditForm>
        </div>
        <header>
          <h1>Welcome {this.state.user}</h1>
          <span>
            <p>Select User</p>
            <select ref="user" name="user" onChange={this.selectMainUser}>
              <option value="admin">admin</option>
              <option value="distributor1">distributor1</option>
              <option value="distributor2">distributor2</option>
              <option value="distributor3">distributor3</option>
            </select>
          </span>
        </header>
        <div id="left-column">
          <PermissionChecker subDist={this.state.subDist} allAreas={this.state.allAreas}></PermissionChecker>
          <SelfInfo user={this.state.user}></SelfInfo>
        </div>
        <div id="right-column">
          <div id="scroll-area">
            <SubDistInfo subDist={this.state.subDist}></SubDistInfo>
          </div>
          <div className="button-bar">
            <span>
              <button onClick={toggleForm}>Add Distributor</button>
            </span>
          </div>
        </div>
      </div>
    );
  }
});

var toggleForm = function() {
  var temp = document.getElementById("edit-form");
  if (temp.style.display == 'block' || temp.style.display=='')
    temp.style.display = 'none';
  else
    temp.style.display = 'block';
};

module.exports = App;
