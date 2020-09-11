import * as React from "react";
import { SpacyParse } from "./main-interface";
import { PreviewToken } from "./preview-token";
import { TextToken } from "./text-token";

interface MainInterface {
    nlp?: SpacyParse | undefined
}

export class Main extends React.Component<{}, MainInterface> {
    constructor(props: {}) {
        super(props);
        this.state = {
            nlp: undefined
        };
    }

    private handleNPL = (nlp: SpacyParse) => {
        this.setState({ nlp: nlp });
    }

    public render() {
        return (
            <main role="main" className="inner cover">
                {this.state.nlp ? <PreviewToken nlp={this.state.nlp} /> : <TextToken nlp={this.handleNPL} />}
            </main >
        )
    }
}