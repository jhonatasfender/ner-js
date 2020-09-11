import * as React from "react";
import { SpacyParse } from "./main-interface";

interface TextTokenStateInterface {
    value: string
}

interface TextTokenPropsInterface {
    nlp: SpacyParse
}

export class TextToken extends React.Component<TextTokenPropsInterface | any, TextTokenStateInterface> {
    private nameTextArea: string = "Text"

    constructor(props: {}) {
        super(props);
        this.state = {
            value: `Além de Paulo Maia, os advogados Carlos Fábio e Sheyner Asfóra disputavam a presidência da OAB/PB.

            Confirmado o resultado, Paulo Maia comemorou a vitória e disse que “a verdade prevaleceu e a advocacia soube escolher aqueles que a honram”. “A gestão foi determinante para vitória.”
            
            Apuradas mais de 95% das urnas, foram registrados 7643 votos, com Paulo Maia obtendo 3.695 (48,34%), Carlos Fábio 2.562 (33,52%) e Sheyner Asfora 1.386 (18,13%). Devido à contabilização de cédulas em urnas manuais, a Comissão Eleitoral, que comandou o pleito, está fazendo o somatório e deve fechar o resultado final nas próximas horas.`
        };

        this.handleChange = this.handleChange.bind(this);
    }

    private handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ value: event.target.value });
    }

    private async handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
        const text: string = this.state.value;
        let doc: SpacyParse | undefined = undefined

        const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
        const credentials = 'same-origin';
        const body = JSON.stringify({ model: 'pt_core_news_sm', text });
        try {
            const res = await fetch('http://localhost:8080/parse', { method: 'POST', headers, credentials, body });
            doc = await res.json();
        } catch (err) {
            console.log(`Error fetching data from API: http://localhost:8080/parse`)
        }
        this.props.nlp(doc);
    }

    public render() {
        return (
            <div className="row">
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text text-vertically">{this.nameTextArea}</span>
                    </div>
                    <textarea
                        className="form-control"
                        aria-label={this.nameTextArea}
                        rows={20}
                        value={this.state.value}
                        onChange={this.handleChange}
                    ></textarea>
                </div>

                <a
                    href="#"
                    className="btn btn-lg btn-secondary"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => this.handleClick(e)}
                >Read</a>
            </div>
        );
    }
}