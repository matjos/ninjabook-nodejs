# The Ninja Book in Node.JS

Get basic info and stats of your favorite tretton37 ninjas.

## How to run

You need a recent version of [Node.JS](http://nodejs.org/) installed. Then you do the following:

1. Clone the repo
2. Install dependencies by executing the following on the cloned copy: `npm install`
3. Symlink the app with: `npm link`
4. Run the app and list the commands with: `ninjabook help`

## Commands

The following commands are available:

### Housekeeping

* `ninjabook update` - Updates the data
* `ninjabook peek ninjaSubString` - Peeks into the JSON data for a ninja whose name matches the given substring.

### Stack overflow

* `ninjabook stack` - Prints out the ninja StackOverflow rep highscore
* `ninjabook stackvets` - Prints out the StackOverflow veterans (sorted by id)
* `ninjabook badges` - Prints out the StackOverflow badge count highscore

### Github

* `ninjabook repos` - Prints out ninjas at Github ranked by number of repos
* `ninjabook gists` - Prints out ninjas at Github ranked by number of gists

### Twitter

Because of bandwidth throttling you need to authenticate to Twitter's API. So if you want to download data from the Twitter API, you need to set the following environment variables with the keys needed.

    export TWITTER_CONSUMER_KEY={the consumer key}
    export TWITTER_CONSUMER_SECRET={the consumer secret}
    export TWITTER_OAUTH_TOKEN={the access token}
    export TWITTER_OAUTH_TOKEN_SECRET={the access token secret}

You can get these OAuth keys by registering an application at [Twitter's Developers site](https://dev.twitter.com/apps). The keys should be listed in the application details page.

* `ninjabook followers` - Prints out top 10 ninjas ranked by number of followers
* `ninjabook friends` - Prints out top 10 ninjas ranked by number of friends
* `ninjabook tweets` - Prints out top 10 ninjas ranked by number of tweets
* `ninjabook stalkers` - Prints out top 10 ninjas ranked by stalker quotient
* `ninjabook badass` - Prints out top 10 ninjas ranked by badass quotient

### Overall

* `ninjabook totals` - Prompts totals for different stats such as repos, gists, etc.

## License

[The MIT license (MIT)](http://opensource.org/licenses/MIT)

Copyright (c) 2013 Mikael Brassman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
