import React, { Component } from 'react';
import Request from '../components/helpers/Request.js'
import '../styles/AddNewArticle.css';


class EditArticleContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: "",
      headline: "",
      date: "",
      author: "",
      content: "",
      imageurl: "",
      keywords: ""
    }

    this.headlineKeyUp = this.headlineKeyUp.bind(this);
    this.dateOnChange = this.dateOnChange.bind(this);
    this.authorKeyUp = this.authorKeyUp.bind(this);
    this.contentKeyUp = this.contentKeyUp.bind(this);
    this.imageurlKeyUp = this.imageurlKeyUp.bind(this);
    this.keywordsKeyUp = this.keywordsKeyUp.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateKeywords = this.updateKeywords.bind(this);
    this.dateForDatabase = this.dateForDatabase.bind(this);
    this.postKeywords = this.postKeywords.bind(this);

  }

  componentWillMount(){
    let request = new Request();

    request.get('/api/articles/'+this.props.id)
    .then(data => {
      const dateObject = data.date;
      this.setState(
        { id: this.props.id,
          headline: data.headline,
          date: this.replaceDate(dateObject),
          author: data._embedded.author.id,
          content: data.content,
          imageurl: data.imageUrl,
        }
      )
    }
  )

  request.get('/api/articles/'+this.props.id+'/keywords').then(data => {
    const keywords = data._embedded.keywords.map((keyword) => {
      return keyword.word+','
    }).join();

    this.setState(
      { keywords: keywords}
    )
  })
}

handleSubmit(event){
  event.preventDefault();
  const newArticle = {
    headline: this.state.headline,
    date: this.dateForDatabase(this.state.date),
    author: "/api/authors/" + this.state.author,
    content: this.state.content,
    imageUrl: this.state.imageurl
  }

  const request = new Request();
  request.put('/api/articles/'+this.props.id, newArticle)
  .then(data => {
    const articlePath = data._links.self.href;
    const keywordsArray = this.state.keywords;
    this.updateKeywords(keywordsArray, articlePath);
  })
  .then (() => {
    window.location = '/'
  })
}

updateKeywords(keyWordsArray, articlePath) {
  const request = new Request();
  request.get('/api/articles/' + this.state.id + '/keywords')
  .then((data) => {
    const oldKeywords = data._embedded.keywords;
    const oldKeywordIds = oldKeywords.map((keyword) => {
      return keyword._links.self.href.split('keywords/')[1];
    })
    oldKeywordIds.forEach((oldId) => {
      request.delete('/api/keywords/' + oldId);
    })
    return data;
  })
  .then((data) => {
    this.postKeywords(keyWordsArray, articlePath);
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

replaceDate(dateObject) {
  const year = dateObject.slice(6, 10);

  let day = dateObject.slice(0, 2);

  let month = dateObject.slice(3, 5);

  const date = year+'-'+month+'-'+day;
  return date;
}

headlineKeyUp(event) {
  this.setState({
    headline: event.target.value
  });
}

dateOnChange(event) {
  this.setState({
    date: event.target.value
  });
}

dateForDatabase(date) {
  let capturedDate = date.slice(8, 10) + "/" + date.slice(5, 7) + "/" + date.slice(0, 4);
  return capturedDate;
}

authorKeyUp(event) {
  this.setState({
    author: event.target.value
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
  console.log(keywordsArray);
}


render(){

  const options = this.props.authors.map((author , index) => {
    return <option key={index}  value={author.id} >{author.name}</option>
  })

    return (

      <div className="New-Article-Box">
        <div className="Form-Wrapper">
        <p className="Edit-Author-Title">Edit Article: </p>
        <form className="New-Article-Form" onSubmit={this.handleSubmit}>
          <label htmlFor="Headline">Headline</label>
          <br></br>
          <input size="70" onChange={this.headlineKeyUp} type="text" id="Headline" value={this.state.headline}/>
          <br></br>
          <label htmlFor="Date">Date</label>
          <br></br>
          <input size="70" onChange={this.dateOnChange} type="date" id="Date" value={this.state.date}/>
          <br></br>
          <label htmlFor="Author">Author</label>
          <br></br>
          <select onChange={this.authorKeyUp} value={this.state.author} id="Author">{options}</select>
          <br></br>
          <label htmlFor="Content">Content</label>
          <br></br>
          <input size="70" onChange={this.contentKeyUp}  type="text" id="Content"
          value={this.state.content}/>
          <br></br>
          <label htmlFor="Image url">Image url</label>
          <br></br>
          <input size="70" onChange={this.imageurlKeyUp} type="text" id="Image url" value={this.state.imageurl}/>
          <br></br>
          <label htmlFor="Keywords">Keywords</label>
          <br></br>
          <input size="70" onChange= {this.keywordsKeyUp} type="text" id="Keywords"
          value={this.state.keywords}/>
          <br></br>
          <input type="submit" value="Save"/>
        </form>
        </div>
      </div>
    )
  }
}

export default EditArticleContainer;
