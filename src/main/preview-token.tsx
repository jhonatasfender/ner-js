import hljs from 'highlight.js';
import * as $ from "jquery";
import * as React from "react";
import { colorHexRandom, contrast } from "../utility/colors-random";
import { Entity, SpacyParse, SummaryEntity, Token } from "./main-interface";
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
    private summaryEntity: SummaryEntity[] = [];

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
        let entities = ""
        for (const summary of this.summaryEntity) {
            const coment = `# start: ${summary.start} | end: ${summary.end} | phrase: ${summary.text}`
            entities += `\n\t\t\t\t(${summary.start_char}, ${summary.end_char - 1}, "${summary.label}"), ${coment}\n\t\t\t`
        }
        return `\n\t\t"""${this.nlp.doc.text}""",\n\t\t{\n\t\t\t'entities': [${entities}]\n\t\t}`
    }

    private handleClickChangeView() {
        const highlight = hljs.highlightAuto(`TRAIN_DATA = [\n\t(${this.getTextWithProperties()}\n\t)\n]`, ["python"])
        this.setState({
            view: !this.state.view,
            html: highlight.value
        })
    }

    public entityToSummaryEntity(entity: Entity): SummaryEntity {
        return {
            id: entity.id,
            start: entity.start,
            end: entity.end,
            label: entity.label,
            end_char: entity.end_char,
            start_char: entity.start_char,
            text: entity.text
        }
    }

    private clickHandlerSave(entity: Entity) {
        const convert = this.entityToSummaryEntity(entity)

        this.summaryEntity.forEach((summary: SummaryEntity, key: number) => {
            if (summary.id == entity.id)
                this.summaryEntity[key] = convert
        })

        this.setState({
            el: this.creatingTokenElements(),
            modal: undefined
        })
    }

    private handleClickModal(event: React.MouseEvent<HTMLDivElement>, token: Token, ent: Entity | undefined) {
        this.setState({
            modal: <ModalSelectEntity
                nlp={this.nlp}
                entity={ent}
                onClickHandlerClose={() => this.setState({ modal: undefined })}
                onClickHandlerSave={(e: Entity) => this.clickHandlerSave(e)}
                onClickHandlerDelete={(e: Entity) => this.onClickHandlerDelete(e)}
            />
        })
    }

    private onClickHandlerDelete(entity: Entity): void {
        this.nlp.ents.forEach((ent: Entity, key: number) => {
            if (ent.id === entity.id)
                delete this.nlp.ents[key]
        })
        
        this.setState({
            el: this.creatingTokenElements(),
            modal: undefined
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

    private elementTypeEntity(ent: Entity | undefined, token: Token) {
        return ent && ent.end - 1 == token.i ? <span className="type-entity">{token.ent_type}</span> : ''
    }

    private creatingTokenElements(): JSX.Element[] {
        const typesEntity = this.colorsBackground
        const el: JSX.Element[] = []

        for (const token of this.nlp.tokens) {
            const classNameDiv = /\n/g.test(token.text) ? "tokens col-12" : "tokens col"
            const ent = this.nlp.ents.filter(ent => ent.start <= token.i && ent.end >= token.i && token.ent_type).shift()

            el.push(
                <div
                    key={token.id}
                    className={classNameDiv}
                    style={{
                        background: ent ? typesEntity[token.ent_type] : "none",
                        color: ent ? contrast(typesEntity[token.ent_type]) : "#fff",
                        borderTopLeftRadius: ent?.start == token.i ? '6px' : 0,
                        borderBottomLeftRadius: ent?.start == token.i ? '6px' : 0,
                        borderTopRightRadius: ent && ent.end - 1 == token.i ? '6px' : 0,
                        borderBottomRightRadius: ent && ent.end - 1 == token.i ? '6px' : 0,
                    }}
                    onMouseOut={e => this.handleMouseOut(e, token)}
                    onMouseMove={e => this.handleMouseIn(e, token)}
                    onClick={e => this.handleClickModal(e, token, ent)}
                >
                    {/\n/g.test(token.text) ? <hr /> : token.text}
                    {this.elementTypeEntity(ent, token)}
                </div>
            )
        }
        return el
    }

    private init() {

        this.state = {
            view: false,
            el: this.creatingTokenElements()
        };

        for (const entity of this.nlp.ents) {
            this.summaryEntity.push(this.entityToSummaryEntity(entity))
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