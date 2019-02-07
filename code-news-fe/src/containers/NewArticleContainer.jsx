import React, { Component } from 'react';
import Request from '../components/helpers/Request.js'
import '../styles/AddNewArticle.css';


class NewArticleContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      headline: "",
      date: "",
      author: "",
      content: "",
      imageurl: "",
      keywords: []
    }

    this.headlineKeyUp = this.headlineKeyUp.bind(this);
    this.dateOnChange = this.dateOnChange.bind(this);
    this.authorKeyUp = this.authorKeyUp.bind(this);
    this.contentKeyUp = this.contentKeyUp.bind(this);
    this.imageurlKeyUp = this.imageurlKeyUp.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.keywordsKeyUp = this.keywordsKeyUp.bind(this);
    this.postKeywords = this.postKeywords.bind(this);
  }

  handleSubmit(event){
    event.preventDefault();
    const newArticle = {
      headline: this.state.headline,
      date: this.state.date,
      author: this.state.author,
      content: this.state.content,
      imageUrl: this.state.imageurl
    }

    const request = new Request();
    request.post('/api/articles', newArticle)
    .then(data => {
      const articlePath = data._links.self.href;
      const keywordsArray = this.state.keywords;
      this.postKeywords(keywordsArray, articlePath);
    })
    .then (() => {
      window.location = '/'
    })

  }

  postKeywords(keyWordsArray, articlePath) {
    const request = new Request();
    keyWordsArray.forEach((keyword) => {
      const keywordObj = {
        word: keyword,
        article: articlePath
      }
      request.post('/api/keywords', keywordObj)
    })
  }

  headlineKeyUp(event) {
    this.setState({
      headline: event.target.value
    });
  }

  dateOnChange(event) {
    const capturedDate = event.target.value;
    this.setState({
      date: capturedDate.slice(8, 10) + "/" + capturedDate.slice(5, 7) + "/" + capturedDate.slice(0, 4)
    });
  }

  authorKeyUp(event) {
    this.setState({
      author: "/api/authors/" + event.target.value
    });
  }

  contentKeyUp(event) {
    this.setState({
      content: event.target.value
    });
  }

  imageurlKeyUp(event) {
    this.setState({
      imageurl: event.target.value
    });
  }

  keywordsKeyUp (event){
    const keywordsArray = event.target.value.split(",");
    this.setState ({
      keywords: keywordsArray
    })
  }

  render(){

    const options = this.props.authors.map((author , index) => {
      return <option key={index} value={author.id} >{author.name}</option>
    })

    options.unshift(<option key="-1" value="default" disabled={true} >Please select an author...</option>)

    return (
      <div className="New-Article-Box">
        <div className="Form-Wrapper">
        <p className="Edit-Author-Title">Add New Article: </p>
          <form className="New-Article-Form" onSubmit={this.handleSubmit}>
            <label htmlFor="Headline">Headline:</label>
            <br></br>
            <input size="70" onKeyUp={this.headlineKeyUp} type="text" id="Headline"/>
            <br></br>
            <label htmlFor="Date">Date:</label>
            <br></br>
            <input size="70" onChange={this.dateOnChange} type="date" id="Date"/>
            <br></br>
            <label htmlFor="Author">Author     </label>
            <br></br>
            <select  onChange={this.authorKeyUp} defaultValue="default" id="Author">{options}</select>
            <br></br>
            <label htmlFor="Content">Content     </label>
            <br></br>
            <input size="70" onKeyUp={this.contentKeyUp}  type="text" id="Content"/>
            <br></br>
            <label htmlFor="Image url">Image url     </label>
            <br></br>
            <input size="70" onKeyUp={this.imageurlKeyUp} type="text" id="Image url"/>
            <br></br>
            <label htmlFor="Keywords">Keywords     </label>
            <br></br>
            <input size="70" onKeyUp={this.keywordsKeyUp}type="text" id="Keywords"/>
            <br></br>
            <input type="submit" value="Save"/>
          </form>
        </div>
      </div>
    )
  }
}

export default NewArticleContainer;
