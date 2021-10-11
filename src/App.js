import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages";
import Post from "./pages/Post";

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="/p/:id">
                    <Post />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
