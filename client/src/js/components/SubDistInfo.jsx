var React = require('react');
var InfoPanel = require('./InfoPanel.jsx');

var SubDistInfo = React.createClass({
  render: function() {
    return(
      <div id="sub-dist-info">
        <InfoPanel></InfoPanel>
        <InfoPanel></InfoPanel>
        <InfoPanel></InfoPanel>
      </div>
    )
  }
});

module.exports = SubDistInfo;
