var Scrub = React.createClass({
    render: function() {
        var nubStyle = {
            left: ((this.props.value * 100) || '0') + '%'
        };
        var fillStyle = {
            width: ((this.props.value * 100) || '0') + '%'
        };
        return (
            <div className="scrub">
                <div className="fill" style={fillStyle}></div>
                <div className="nub" style={nubStyle}></div>
            </div>
        );
    },

    _onChange: function() {
        this.props._onChange();
    }
});

var TimeStamp = React.createClass({
    render: function() {
        return (
            <span className="timeStamp">
                {this.formatTimeStamp(this.props.date)}
            </span>
        );
    },

    formatTimeStamp: function(date) {
        return this.pad(date.getMinutes(), 2) + ':' + this.pad(date.getSeconds(), 2);
    },

    pad: function(n, width, z) {
        z = z || '0';
        n = (n || '0') + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
});

var ScrubContainer = React.createClass({
    render: function() {
        return (
            <div className="bottomStrip">
                <TimeStamp date={this.props.time} />

                <Scrub value={this.props.time.getTime() / this.props.duration.getTime()} />

                <TimeStamp date={this.props.duration} />
            </div>
        );
    }
});