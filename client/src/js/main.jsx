var React = require('react');
var ReactDOM = require('react-dom');

var Foo = React.createClass({
  render: function(){
    return (
      <h1>Hello World!</h1>
    );
  }
})

ReactDOM.render(<Foo />, document.getElementById("app"));
