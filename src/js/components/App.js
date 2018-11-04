import React,{Component} from "react";
import io from "socket.io-client";
const socket = io("http://localhost:3000");

class App extends Component{
    componentDidMount(){
        console.log(socket);
    }
    render(){
        return (<div></div>);
    }
}

export default App;