var React = require('react');
var InfoPanel = require('./InfoPanel.jsx');

var SelfInfo = React.createClass({
  render: function() {
    return(
      <div id="self-info">
        <InfoPanel></InfoPanel>
      </div>
    )
  }
});

module.exports = SelfInfo;
