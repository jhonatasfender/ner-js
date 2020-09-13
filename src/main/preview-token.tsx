import hljs from 'highlight.js';
import * as $ from "jquery";
import * as React from "react";
import { colorHexRandom, contrast } from "../utility/colors-random";
import { Entity, SpacyParse, Token } from "./main-interface";
import { ModalSelectEntity } from "./modal";

interface PreviewTokenInterface {
    divHover?: JSX.Element | null,
    modal?: JSX.Element | undefined,
    view: boolean,
    html?: any,
    el: JSX.Element[]
}

interface PreviewTokenPropsInterface {
    nlp: SpacyParse
}

export class PreviewToken extends React.Component<PreviewTokenPropsInterface | any, PreviewTokenInterface> {
    constructor(props: {}) {
        super(props);

        this.init()

        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleMouseIn = this.handleMouseIn.bind(this);
        this.handleClickChangeView = this.handleClickChangeView.bind(this);
        this.handleClickModal = this.handleClickModal.bind(this);
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
        return `\n\t\t"${this.nlp.doc.text}",\n\t\t{\n\t\t\t'entities': [\n\t\t\t\t(7, 17, "DATE")\n\t\t\t]\n\t\t}`
    }

    private handleClickChangeView() {
        const highlight = hljs.highlightAuto(`TRAIN_DATA = [\n\t(${this.getTextWithProperties()}\n\t)\n]`)
        console.log(highlight)
        this.setState({
            view: !this.state.view,
            html: highlight.value
        })
    }


    private handleClickModal(event: React.MouseEvent<HTMLDivElement>, token: Token, ent: Entity) {
        this.setState({
            modal: <ModalSelectEntity nlp={this.nlp} entity={ent} />
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

    private get nlp(): SpacyParse {
        return this.props.nlp as SpacyParse;
    }

    private get colorsBackground(): { [key: string]: string } {
        return Array.from(new Set(this.nlp.ents.map(ent => ent.label)))
            .reduce((a: any, b: string) => (a[b] = colorHexRandom(), a), {})
    }

    private elementTypeEntity(ent: Entity[], token: Token) {
        return ent.length && ent[0].end - 1 == token.i ? <span className="type-entity">{token.ent_type}</span> : ''
    }

    private init() {
        let key = 0

        this.state = {
            view: false,
            el: []
        };

        const typesEntity = this.colorsBackground

        for (const token of this.nlp.tokens) {
            const classNameDiv = /\n/g.test(token.text) ? "tokens col-12" : "tokens col"

            const ent = this.nlp.ents.filter(ent => ent.start <= token.i && ent.end >= token.i && token.ent_type)

            if (ent.length) {
                console.log(token.text, token.ent_type, token.i, ent[0].start, ent[0].end)
            }

            this.state.el.push(
                <div
                    key={key}
                    className={classNameDiv}
                    style={{
                        background: ent.length ? typesEntity[token.ent_type] : "none",
                        color: ent.length ? contrast(typesEntity[token.ent_type]) : "none",
                    }}
                    onMouseOut={e => this.handleMouseOut(e, token)}
                    onMouseMove={e => this.handleMouseIn(e, token)}
                    onClick={e => this.handleClickModal(e, token, ent[0])}
                >
                    {/\n/g.test(token.text) ? <hr /> : token.text}
                    {this.elementTypeEntity(ent, token)}
                </div>
            )
            key++
        }
    }

    public render() {
        return (
            <div className="container">
                <div className="row">
                    <button className="btn btn-primary btn-lg btn-block" type="button" onClick={this.handleClickChangeView}>Result</button>
                </div>
                {
                    !this.state.view ?
                        <div className="row token-list">{this.state.el}</div> :
                        <div className="row mt-3">
                            <pre dangerouslySetInnerHTML={{ __html: this.state.html }} />
                        </div>
                }

                {this.state.divHover}
                {this.state.modal}

            </div>
        )
    }
}