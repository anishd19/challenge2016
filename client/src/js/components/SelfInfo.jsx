var React = require('react');
var InfoPanel = require('./InfoPanel.jsx');
var helper = require('../helper.js');

var SelfInfo = React.createClass({
  getInitialState: function() {
    return ({
      infoData: {
        name:"admin",
        include: ["all"],
        exclude: ["none"]
      }
    });
  },
  componentWillReceiveProps: function(nP) {
    if(nP.user){
      helper.getInfoPanelData(nP.user, (infoData) => {
        this.setState({
          infoData: {
            name: infoData.name,
            include: infoData.include,
            exclude: infoData.exclude
          }
        })
      });
    }
  },
  render: function() {
    return(
      <div id="self-info">
        <InfoPanel infoData={this.state.infoData}></InfoPanel>
      </div>
    );
  }
});

module.exports = SelfInfo;
