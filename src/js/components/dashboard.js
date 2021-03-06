import React from 'react';
import jQuery from 'jquery';
let moment = require('moment');
moment().format();

import HeaderDashboard from '../headers/header-dashboard';
import CreateTweet from '../models/create-tweet';
import TweetList from './tweet-list';


class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasLoaded: false,
      tweets: [],
      user: {}
    };
  }
  componentDidMount() {
    this.getTweets();
  }

  getTweets() {
    jQuery.ajax('https://twitterapii.herokuapp.com/users.json?include=tweets')
          .then( response => {
            let tweets = response.included;
            let users = response.data;
            let tweetData = tweets.map(function(tweet){
              return {
                id: tweet.id,
                body: tweet.attributes.body,
                created_at: tweet.attributes.created_at,
                userId: tweet.relationships.user.data.id,
                email: users.filter(function(user) {
                  return user.id === tweet.relationships.user.data.id
                })[0].attributes.email
              }
            });
            this.setState({
              hasLoaded: true,
              tweets: tweetData,
              user: users[22]
            });
          });
  }

  render(){
    return(
      <div className="wrapper">
        <HeaderDashboard/>
        <main>
          <CreateTweet user={this.state.user}/>
          <TweetList tweets={this.state.tweets}
                     hasLoaded={this.state.hasLoaded}/>
        </main>
      </div>
    )
  }
}

export default Dashboard;
