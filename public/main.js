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
			);
		});
		return (
			<div className="wordsList">
				{wordNodes}
			</div>
		);
	}
});

var NewWordForm = React.createClass({
	getInitialState: function() {
		return {word: ""};
	},
	handleSubmit: function(e) {
		e.preventDefault();
		var word = this.state.word.trim();
		if (!word) {
			return;
		}
		this.props.onWordSubmit({word: word});
		this.setState({word: ""});
	},
	handleWordChange: function(e) {
		this.setState({word: e.target.value});
	},
	render: function() {
		return (
			<form className="newWordForm" onSubmit={this.handleSubmit}>
				<input
					type="text"
					value={this.state.word}
					onChange={this.handleWordChange}
				/>
				<input type="submit" value="Enter" />
			</form>
		);
	}
});

var Story = React.createClass({
	loadStory: function() {
		$.ajax({
			url: this.props.url,
			dataType: "json",
			cache: false,
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
	        	console.error(this.props.url, status, err.toString());
	      	}.bind(this)
		});
	},
	getInitialState: function() {
		return {data: []};
	},
	componentDidMount: function() {
		this.loadStory();
		setInterval(this.loadStory, this.props.pollInterval);
	},
	handleWordSubmit: function(word) {
		$.ajax({
			url: this.props.url,
			dataType: "json",
			type: "POST",
			data: word,
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
	        	console.error(this.props.url, status, err.toString());
	      	}.bind(this)
		});
	},
	render: function() {
		var wordsList;
		if (this.state.data.length == 0) {
			wordsList = [];
		} else {
			wordsList = this.state.data[0].words;
		}
		return (
			<div className = "story">
				<WordsList data={wordsList}/>
				<NewWordForm onWordSubmit={this.handleWordSubmit} />
			</div>
		);
	}
});

ReactDOM.render(
	<Story url="/story" pollInterval={1000} />,
	document.getElementById("content")
);