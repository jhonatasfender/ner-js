import * as React from "react";
import { render } from "react-dom";
import { Main } from "./main/main";
import * as $ from "jquery"

import '../css/style.scss';

class App extends React.Component<{}, {}> {

    render() {
        return (
            <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
                <header className="masthead mb-auto">
                    <div className="inner">
                        <h3 className="masthead-brand">Cover</h3>
                        <nav className="nav nav-masthead justify-content-center">
                            <a className="nav-link active" href="#">Home</a>
                            <a className="nav-link" href="#">About</a>
                        </nav>
                    </div>
                </header>

                <Main />

                <footer className="mastfoot mt-auto">
                    <div className="inner">
                        <p>Cover template for <a href="https://getbootstrap.com/">Bootstrap</a>, by <a href="https://twitter.com/mdo">@mdo</a>.</p>
                    </div>
                </footer>
            </div>
        )
    }
}

render(
    <App />, $("#app").get(0)
);
