/** @jsx React.DOM */
var React = require('react');

/* Components */
var Column = require('./Column.react');

/* Helpers */
var _     = require('lodash');

/* Stores */
var TableStore = require('../stores/TableStore');

// State actions
function getStateFromStore() {
  return {
    table: TableStore.getActiveTable()
  };
}

var ColumnsPreview = React.createClass({
  displayName: 'Columns',

  getInitialState: function() {
    return getStateFromStore();
  },

  componentDidMount: function() {
    TableStore.addStoreListener('select', this._onChange);
    TableStore.addStoreListener('change', this._onChange);
  },

  componentWillUnmount: function() {
    TableStore.removeStoreListener('select');
    TableStore.removeStoreListener('change');
  },

  render: function () {
    if( this.state.table && this.state.table.columns ) {
      return this._renderColumns(this.state.table.columns);
    } else {
      return this._renderEmptyMessage();
    }
  },

  /* Internal Helpers ------------------------------------------------------- */
  _renderColumns: function(collection) {
    var columns;

    var partitions = _.chain(collection).where({partition: true}).sortBy('name').value(),
        normalCols = _.chain(collection).where({partition: false}).sortBy('name').value();

    columns = _.chain(partitions.concat(normalCols)).reduce(function(m, col) {
      var reuseGroup = (m.length > 0) && (m[m.length - 1].length < 4),
          group = reuseGroup ? m[m.length - 1] : [],
          val;

      group.push(<Column key={col.name} name={col.name} type={col.type} />);

      if (!reuseGroup) {
        m.push(group);
      }

      return m;
    }, []).map(function(col, i) {
      return (<div className="row" key={'col-row-' + i}>{col}</div>);
    }).value();

    // Render the template
    return (<div>{columns}</div>);
  },

  _renderEmptyMessage: function() {
    return (
      <div className="alert alert-warning">
        <p>There are no columns, or there is no table selected. Please selected (another) table.</p>
      </div>
    )
  },

  _capitalize: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  /* Store events */
  _onChange: function() {
    this.setState(getStateFromStore());
  }
});

module.exports = ColumnsPreview;
