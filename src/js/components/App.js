import React,{Component} from "react";
import io from "socket.io-client";


class App extends Component{
    componentDidMount(){
        console.log("io",io);
    }
    render(){
        return (<div></div>);
    }
}

export default App;