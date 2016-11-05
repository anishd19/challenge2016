var React = require('react');

var EditForm = React.createClass({
  getOptionList: function() {
    let subDist = ["distributor1", "distributor2", "distributor3", "distributor4", "distributor5"];
    let optionList = [];
    subDist.forEach(function(name, i) {
      optionList.push(
        <option key={i} value={name}>{name}</option>
      );
    });
    return optionList;
  },
  render: function() {
    let optionList = this.getOptionList();
    return(
      <div>
        <p>Select User</p>
        <select name="user">
          {optionList}
        </select>
        <div id="foo">
          <input />
          <button className="green">include</button>
          <button className="red">exclude</button>
        </div>
        <div>
          <div id="lc">
            <div className="panel">
              <div className="panel-heading green">Include</div>
              <div className="panel-body">Karnataka, Chennai</div>
            </div>
          </div>
          <div id="rc">
            <div className="panel">
              <div className="panel-heading red">Exclude</div>
              <div className="panel-body">India, United States</div>
            </div>
          </div>
        </div>
        <div id="foo">
          <button>Submit</button>
          <button onClick={this.props.toggleForm}>Dicard</button>
        </div>
      </div>
    );
  }
});

module.exports = EditForm;
