CHAT ASSESSTMENT UI
----

A simple browser-based chat application using Node.JS.
This application allow several users to talk in a chatroom and also to get stock quotes
from an API using a specific command.


Features
---
1. Allow registered users to log in and talk with other users in a chatroom.
2. Allow users to post messages as commands into the chatroom with the following format
/stock=stock_code
3. Create a decoupled bot that will call an API using the stock_code as a parameter
(https://stooq.com/q/l/?s=aapl.us&f=sd2t2ohlcv&h&e=csv, here aapl.us is the
stock_code)
4. The bot should parse the received CSV file and then it should send a message back into
the chatroom. The message will be a stock quote using the following format: “APPL.US quote is $93.42 per share”. The post owner will be
the bot.
5. Have the chat messages ordered by their timestamps and show only the last 50
messages.

Instructions
---
1. Clone repository
2. Run *npm install* 
5. Run *npm start* to start the application
    App will start on http://localhost:3000 
