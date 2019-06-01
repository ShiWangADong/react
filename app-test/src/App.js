import React from "react";
import { HashRouter, NavLink, Route, Switch } from "react-router-dom";
import { router } from "./constants/router";

function App() {
    return (
        <HashRouter>
            <div className="App">
                <header>
                    {router.map(item => (
                        <NavLink key={item.id} to={item.path}>
                            {item.title}
                        </NavLink>
                    ))}
                </header>
                <Switch>
                    <Route exact strict path="/" render={() => <div>首页</div>} />
                    {router.map(item => (
                        <Route key={item.id} path={item.path} render={() => <div>{item.title}</div>} />
                    ))}
                    <Route render={() => <div>未找到页面</div>} />
                </Switch>
            </div>
        </HashRouter>
    );
}

export default App;
