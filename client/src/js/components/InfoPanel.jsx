var React = require('react');

var InfoPanel = React.createClass({
  render: function() {
    return(
      <div className="info-panel">
        <div className="panel-heading">--DISTRIBUTOR NAME--</div>
        <div className="panel">
          <div className="panel-heading green">Include</div>
          <div className="panel-body">India, United States</div>
        </div>

        <div className="panel">
          <div className="panel-heading red">Exclude</div>
          <div className="panel-body">Karnataka, Chennai</div>
        </div>
      </div>
    )
  }
});

module.exports = InfoPanel;
