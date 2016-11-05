var React = require('react');
var EditForm = require('./EditForm.jsx');
var PermissionChecker = require('./PermissionChecker.jsx');
var SelfInfo = require('./SelfInfo.jsx');
var SubDistInfo = require('./SubDistInfo.jsx');

var App = React.createClass({
  getInitialState: function() {
    return {
      user: "admin",
      sudDist: ["distributor1", "distributor2", "distributor3", "distributor4", "distributor5"]
    }
  },
  selectUser: function() {
    this.setState({
      user: this.refs.user.value
    })
  },
  render: function() {
    return (
      <div>
        <div id="edit-form">
          <EditForm toggleForm={toggleForm} subDist={this.state.subDist}></EditForm>
        </div>
        <header>
          <h1>Welcome {this.state.user}</h1>
          <span>
            <p>Select User</p>
            <select ref="user" name="user" onChange={this.selectUser}>
              <option value="admin">admin</option>
              <option value="distributor1">distributor1</option>
              <option value="distributor2">distributor2</option>
              <option value="distributor3">distributor3</option>
              <option value="distributor4">distributor4</option>
              <option value="distributor5">distributor5</option>
            </select>
          </span>
        </header>
        <div id="left-column">
          <PermissionChecker></PermissionChecker>
          <SelfInfo></SelfInfo>
        </div>
        <div id="right-column">
          <div id="scroll-area">
            <SubDistInfo></SubDistInfo>
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
}

module.exports = App;
