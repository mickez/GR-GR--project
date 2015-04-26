var Scrub = React.createClass({
    getInitialState: function () {
        return {
            value: NaN
        };
    },

    componentDidMount: function () {
        window.addEventListener('mousemove', this._onMouseMove);  
        window.addEventListener('mouseup', this._onMouseUp);  
    },

    componentWillUnmount: function () {
        window.removeEventListener('mousemove', this._onMouseMove);  
        window.removeEventListener('mouseup', this._onMouseUp);  
    },

    render: function() {
        var value = !isNaN(this.state.value) ? this.state.value * 100 : (this.props.value * 100 || '0')
        var nubStyle = {
            left: value + '%'
        };
        var fillStyle = {
            width: nubStyle.left
        };
        return (
            <div className="scrub" onMouseDown={this._onMouseDown}>
                <div className="fill" style={fillStyle}></div>
                <div className="nub" style={nubStyle}></div>
            </div>
        );
    },

    _onMouseDown: function(event) {
        this.setState({scrubbing: true});
        document.body.className += ' scrubbing';
        this._moveNub(event);
    },

    _onMouseMove: function(event) {
        if (!this.state.scrubbing) return;

        this._moveNub(event);
    },

    _moveNub: function(event) {
        var node = this.getDOMNode();

        var mouseMoveX = event.pageX - node.getBoundingClientRect().left
        var value = Math.min(Math.max(mouseMoveX / node.clientWidth, 0), 1);

        this.setState({
            value: value
        });        
    },

    _onMouseUp: function(event) {
        if (!this.state.scrubbing) return;

        this._onChange({value: this.state.value});
        this.setState({value: NaN, scrubbing: false});
        document.body.className = document.body.className.replace(/scrubbing/g, '');
    },

    _onChange: function(props) {
        this.props.onChange(props);
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

                <Scrub value={this.props.time.getTime() / this.props.duration.getTime()} onChange={this._onChange} />

                <TimeStamp date={this.props.duration} />
            </div>
        );
    },

    _onChange: function(props) {
        this.props.onChange(props);
    }
});