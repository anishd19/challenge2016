var React = require('react');

var PermissionChecker = React.createClass({
  render: function() {
    return(
      <div id="permission-checker">
        <h4>Permission Checker</h4>
        <input />
        <input />
        <button>OK</button>
        <div><h2>YES</h2></div>
      </div>
    )
  }
});

module.exports = PermissionChecker;
