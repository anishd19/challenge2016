var React = require('react');
var InfoPanel = require('./InfoPanel.jsx');
var helper = require('../helper.js');

var SubDistInfo = React.createClass({
  getInitialState: function() {
    return({
      infoDataArr: []
    });
  },
  componentWillReceiveProps: function(nP) {
    let subDist = nP.subDist;
    var ida = [];
    function foo() {
      return new Promise(function(resolve, reject) {
        if(!subDist.length > 0) {
          ida.push({
            name: 'Sub Distributor Name',
            include: [{
                city: 'No Sub Distributor has been added.',
                province: 'all',
                country: 'all'
            }],
            exclude: [],
            authBy: 'sudo'
          });
          resolve();
        }else {
          subDist.forEach((v, i, arr) => {
            helper.getInfoPanelData(v, (info) => {
              ida.push(
                info
              );
              if(i == arr.length - 1) resolve();
            });
          });
        }
      });
    };
    foo().then(() => {
      this.setState({
        infoDataArr: ida
      });
    });
  },
  generateFrag: function() {
    var ida = this.state.infoDataArr;
    let f = [];
    ida.forEach(function(o, i) {
      f.push(
        <InfoPanel key={i} infoData={o}></InfoPanel>
      );
    });
    return f;
  },
  render: function() {
    var frag = this.generateFrag();
    return(
      <div id="sub-dist-info">
        {frag}
      </div>
    );
  }
});

module.exports = SubDistInfo;
