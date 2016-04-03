// var React = require('react');
// var ReactDOM = require('react-dom');
// var Babel = require('babel-core');
// var Jquery = require('jquery');

var Word = React.createClass({
	render: function() {
		return(
			<div className="word">
				{this.props.data}
			</div>
		);
	}
});

var WordsList = React.createClass({
	render: function() {
		console.log("here");
		var wordNodes = this.props.data.map(function(word) {
			return(
				<Word data={word} />
			)
		});
		return (
			<div className="wordsList">
				{wordNodes}
			</div>
		);
	}
});

var Story = React.createClass({
	loadStory: function() {
		console.log("loadStory");
		$.ajax({
			url: this.props.url,
			dataType: "json",
			cache: false,
			success: function(data) {
				console.log("ajax load success");
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
	        	console.error(this.props.url, status, err.toString());
	      	}.bind(this)
		});
	},
	getInitialState: function() {
		console.log("getInitialState");
		return {data: []};
	},
	componentDidMount: function() {
		console.log("mounted");
		this.loadStory();
		setInterval(this.loadStory, this.props.pollInterval);
	},
	render: function() {
		console.log(this.state);
		var wordsList;
		if (this.state.data.length == 0) {
			wordsList = [];
		} else {
			wordsList = this.state.data[0].words;
		}
		return (
			<div className = "story">
				<WordsList data={wordsList}/>
			</div>
		);
	}
});

ReactDOM.render(
	<Story url="/story" pollInterval={1000} />,
	document.getElementById("content")
);