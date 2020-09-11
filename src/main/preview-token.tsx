import * as $ from "jquery";
import * as React from "react";
import { SpacyParse, Token } from "./main-interface";
import hljs from 'highlight.js';

interface PreviewTokenInterface {
    divHover: any,
    view: boolean,
    html?: any
}

interface PreviewTokenPropsInterface {
    nlp: SpacyParse
}

export class PreviewToken extends React.Component<PreviewTokenPropsInterface | any, PreviewTokenInterface> {
    constructor(props: {}) {
        super(props);
        console.log(this.props.nlp)
        this.state = {
            divHover: null,
            view: false
        };

        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleMouseIn = this.handleMouseIn.bind(this);
        this.handleClickChangeView = this.handleClickChangeView.bind(this);
    }

    private centerInViewport(el: any) {
        var el2 = el;
        var curtop = 0;
        var curleft = 0;
        if (document.getElementById || document.all) {
            do {
                curleft += el.offsetLeft - el.scrollLeft;
                curtop += el.offsetTop - el.scrollTop;
                el = el.offsetParent;
                el2 = el2.parentNode;
                while (el2 != el) {
                    curleft -= el2.scrollLeft;
                    curtop -= el2.scrollTop;
                    el2 = el2.parentNode;
                }
            } while (el.offsetParent);

        }
        return [curtop, curleft];
    }

    private getTextWithProperties() {
        return `\n\t\t"${this.props.nlp.doc.text}",\n\t\t{\n\t\t\t'entities': [\n\t\t\t\t(7, 17, "DATE")\n\t\t\t]\n\t\t}`
    }

    private handleClickChangeView() {
        const highlight = hljs.highlightAuto(`TRAIN_DATA = [\n\t(${this.getTextWithProperties()}\n\t)\n]`)
        console.log(highlight)
        this.setState({
            view: !this.state.view,
            html: highlight.value
        })
    }

    private handleMouseIn(event: React.MouseEvent<HTMLDivElement>, token: Token) {
        const [top, left] = this.centerInViewport(event.target)

        $(event.target).addClass("tooltip-custom-over")

        this.setState({
            divHover:
                <div
                    className="tooltip-custom"
                    style={{
                        top: (top - (/\n/g.test(token.text) ? 290 : 320)) + "px",
                        left: left + "px",
                    }}
                >
                    <ul className="list-group">
                        <li className="list-group-item">{token.text}</li>
                        <li className="list-group-item">{token.lemma}</li>
                        <li className="list-group-item">{token.pos}</li>
                        <li className="list-group-item">{token.tag}</li>
                        <li className="list-group-item">{token.head.text}</li>
                        <li className="list-group-item">({token.position_start_text}, {token.position_end_text})</li>
                    </ul>
                </div>
        });
    }

    private handleMouseOut(event: React.MouseEvent<HTMLDivElement>, token: Token) {
        $(event.target).removeClass("tooltip-custom-over")
        this.setState({ divHover: null })
    }

    public render() {
        let key = 0
        const el = []
        for (const token of this.props.nlp.tokens) {
            const classNameDiv = /\n/g.test(token.text) ? "tokens col-12" : "tokens col"

            el.push(
                <div
                    key={key}
                    className={classNameDiv}
                    onMouseOut={e => this.handleMouseOut(e, token)}
                    onMouseMove={e => this.handleMouseIn(e, token)}
                >
                    {/\n/g.test(token.text) ? <hr /> : token.text}
                </div>
            )
            key++
        }

        return (
            <div className="container">
                <div className="row">
                    <button className="btn btn-primary btn-lg btn-block" type="button" onClick={this.handleClickChangeView}>Result</button>
                </div>
                {
                    !this.state.view ?
                        <div className="row token-list">{el}</div> :
                        <div className="row mt-3">
                            <pre dangerouslySetInnerHTML={{ __html: this.state.html }} />
                        </div>
                }

                {this.state.divHover}
            </div>
        )
    }
}