var http    =  require('http');
var mockserver  =  require('mockserver');

http.createServer(mockserver("./mocks"))
    .listen(8888);