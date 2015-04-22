var DiscComponent = React.createClass({
    render: function() {
        var actionClass = 'fa pausePlayIcon ' + this.getIconClass(this.props.icon);
        var mutedClass = 'fa muteIcon ' + (this.props.muted ? 'fa-volume-off' : 'fa-volume-up')

        return (
            <div className="disk">
            
                <div className="pausePlay" id="pauseBtn" onClick={this._action}>
                    <i className={actionClass}></i>             
                </div>
                    
                <div className="muteUnmute">
                    <i className={mutedClass} onClick={this._mute}></i>
                </div>
                    
                <div className="browseFile">
                    <i className="fa fa-folder-open browseFileIcon" onClick={this._browse}></i>
                </div>

            </div>
        );
    },

    getIconClass: function(value) {
        if (value === undefined) return 'fa-folder-open';
        return value ? 'fa-play' : 'fa-pause';
    },

    _action: function() {
        this.props.onAction();
    },

    _mute: function() {
        this.props.onMute()
    },

    _browse: function() {
        this.props.onBrowse();
    }
});