var React = require('react');
var PropTypes = require('prop-types');

module.exports = class extends React.Component {
    static propTypes = {
        name: PropTypes.string
    }

    render() {
        return <div>{this.props.name}</div>
    }
}