var React = require('react');

var InfoPanel = React.createClass({
  ieToString: function(arr) {
    let str = "";
    arr.forEach(function(o, i, arr) {
      switch (true) {
        case(o.city !== "all" && !!o.city): str = str.concat(o.city); break;
        case(o.province !== "all" && !!o.province): str = str.concat(o.province); break;
        case(o.country !== "all" && !!o.country): str = str.concat(o.country); break;
        default:  break;
      }
      str = str.concat(", ");
    });
    if(str === ", ") str = "You've logged in as Admin";
    return(str);
  },
  defaultProps: {
    name: 'admin',
    include: [{
        city: 'all',
        province: 'all',
        country: 'all'
    }],
    exclude: [],
    authBy: 'sudo'
  },
  render: function() {
    let temp = this.props.infoData;
    let name = "my custom undefined", include = "my custom undefined", exclude = "my custom undefined";
    if(!!temp) {
      name = temp.name;
      include = this.ieToString(temp.include) || "You're not into the system yet";
      exclude = this.ieToString(temp.exclude);
    }
    return(
      <div className="info-panel">
        <div className="panel-heading">{name}</div>
        <div className="panel">
          <div className="panel-heading green">Include</div>
          <div className="panel-body">{include}</div>
        </div>

        <div className="panel">
          <div className="panel-heading red">Exclude</div>
          <div className="panel-body">{exclude}</div>
        </div>
      </div>
    );
  }
});

module.exports = InfoPanel;
