import * as React from "react";
import { Entity, SpacyParse } from "./main-interface";


interface ModalSelectEntityInterface {
    textEntity?: string,
    entity: Entity
}

interface ModalSelectEntityPropsInterface {
    entity: Entity,
    nlp: SpacyParse,
    onClickHandlerClose: () => void
    onClickHandlerSave: (entity: Entity) => void
}

export class ModalSelectEntity extends React.Component<ModalSelectEntityPropsInterface | any, ModalSelectEntityInterface> {
    constructor(props: {}) {
        super(props);

        this.state = {
            textEntity: this.getSenteceOfPhrase(),
            entity: this.entity,
        };

        this.handleClickStartLess = this.handleClickStartLess.bind(this)
        this.handleClickStartMore = this.handleClickStartMore.bind(this)
        this.handleClickEndLess = this.handleClickEndLess.bind(this)
        this.handleClickEndMore = this.handleClickEndMore.bind(this)
    }

    private handleClickStartLess(): void {
        let { entity } = this.state
        entity.start--
        entity.text = this.getSenteceOfPhrase()
        entity.start_char = this.nlp.doc.text.indexOf(entity.text)

        this.setState({ entity, textEntity: entity.text })
        this.nlp.tokens[entity.start].ent_type = entity.label
    }

    private handleClickStartMore(): void {
        let { entity } = this.state
        this.nlp.tokens[entity.start].ent_type = ""
        entity.start++
        entity.text = this.getSenteceOfPhrase()
        entity.start_char = this.nlp.doc.text.indexOf(entity.text)

        this.setState({ entity, textEntity: entity.text })
    }

    private handleClickEndLess(): void {
        let { entity } = this.state
        this.nlp.tokens[entity.end - 1].ent_type = ""
        entity.end--
        entity.text = this.getSenteceOfPhrase()
        entity.end_char = this.nlp.doc.text.indexOf(entity.text)

        this.setState({ entity, textEntity: entity.text })
    }

    private handleClickEndMore(): void {
        let { entity } = this.state
        entity.end++
        entity.text = this.getSenteceOfPhrase()
        entity.end_char = this.nlp.doc.text.indexOf(entity.text) + entity.text.length

        this.setState({ entity, textEntity: entity.text })
        this.nlp.tokens[entity.end - 1].ent_type = entity.label
    }

    private get nlp(): SpacyParse {
        return this.props.nlp as SpacyParse;
    }

    private get entity(): Entity {
        return this.state?.entity ? this.state.entity : this.props.entity as Entity;
    }

    private getSenteceOfPhrase(): string {
        const words = this.nlp.tokens.filter(x => x.i >= this.entity.start && x.i <= this.entity.end - 1)
        return words.map(x => x.text_with_ws).join('')
    }

    private keyUpHandleLabelEntity(e: React.KeyboardEvent<HTMLInputElement>) {
        const el = e.target as HTMLInputElement
        const entity = this.entity

        el.value = el.value.toUpperCase().replace(/[\s/\\{}()+*.]/g, '-')
        entity.label = el.value
        this.setState({ entity })
        this.nlp.tokens[entity.start].ent_type = entity.label
        this.nlp.tokens[entity.end - 1].ent_type = entity.label
    }

    public render() {
        return (
            <div className="modal fade show" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Reorganizando as entidades</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.onClickHandlerClose}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-2 arrow" onClick={this.handleClickStartLess}>&#8592;</div>
                                <div className="col">
                                    <input type="text" className="form-control" disabled value={this.entity.start} />
                                </div>
                                <div className="col-2 arrow" onClick={this.handleClickStartMore}>&#8594;</div>
                                <div className="col-2 arrow" onClick={this.handleClickEndLess}>&#8592;</div>
                                <div className="col">
                                    <input type="text" className="form-control" disabled value={this.entity.end - 1} />
                                </div>
                                <div className="col-2 arrow" onClick={this.handleClickEndMore}>&#8594;</div>
                            </div>
                            <div className="row mt-3">
                                <input type="text" className="form-control" defaultValue={this.entity.label} onKeyUp={e => this.keyUpHandleLabelEntity(e)} />
                            </div>
                            <div className="row mt-4">
                                <div className="col">
                                    <p className="text-center">{this.state.textEntity}</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={() => { this.props.onClickHandlerSave(this.entity) }}>Save</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.props.onClickHandlerClose}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}