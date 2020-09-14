
export interface SpacyParse {
    model: string;
    doc: Doc;
    ents: Entity[];
    sents: Sent[];
    noun_chunks: any[];
    tokens: Token[];
}


export interface SummaryEntity {
    id: number;
    start: number;
    end: number;
    label: string;
    end_char: number;
    start_char: number;
    text: string;
}

export interface Entity {
    id: number;
    start: number;
    end: number;
    label: string;
    label_number: number;
    text: string;
    conjuncts: any[];
    end_char: number;
    ent_id: number;
    ent_id_: string;
    ents: any[];
    kb_id: number;
    kb_id_: string;
    label_: string;
    lemma_: string;
    lower_: string;
    n_lefts: number;
    n_rights: number;
    orth_: string;
    root: Root;
    sentiment: number;
    start_char: number;
    string: string;
    text_with_ws: string;
    upper_: string;
}

export interface Root {
    sent: Sent;
    tensor: string[];
    text: string;
    text_with_ws: string;
    whitespace: string;
    orth: string;
    head: Token;
    left_edge: Token;
    right_edge: Token;
    i: number;
    ent_type: string;
    ent_iob: string;
    ent_kb_id: number;
    ent_kb_id_: string;
    ent_id: string;
    lemma: string;
    norm: string;
    lower: string;
    shape: string;
    prefix: string;
    suffix: string;
    is_alpha: boolean;
    is_ascii: boolean;
    is_digit: boolean;
    is_lower: boolean;
    is_upper: boolean;
    is_title: boolean;
    is_punct: boolean;
    is_left_punct: boolean;
    is_right_punct: boolean;
    is_space: boolean;
    is_bracket: boolean;
    is_quote: boolean;
    is_currency: boolean;
    like_url: boolean;
    like_num: boolean;
    like_email: boolean;
    is_oov: boolean;
    is_stop: boolean;
    pos: string;
    tag: string;
    dep: string;
    lang: string;
    prob: number;
    idx: number;
    sentiment: number;
    lex_id: number;
    rank: number;
    cluster: number;
    position_start_text: number;
    position_end_text: number;
}

export interface Token {
    id: number,
    sent: Sent;
    tensor: string[];
    text: string;
    text_with_ws: string;
    whitespace: string;
    orth: string;
    head: Token;
    left_edge: Token;
    right_edge: Token;
    i: number;
    ent_type: string;
    ent_iob: string;
    ent_kb_id: number;
    ent_kb_id_: string;
    ent_id: string;
    lemma: string;
    norm: string;
    lower: string;
    shape: string;
    prefix: string;
    suffix: string;
    is_alpha: boolean;
    is_ascii: boolean;
    is_digit: boolean;
    is_lower: boolean;
    is_upper: boolean;
    is_title: boolean;
    is_punct: boolean;
    is_left_punct: boolean;
    is_right_punct: boolean;
    is_space: boolean;
    is_bracket: boolean;
    is_quote: boolean;
    is_currency: boolean;
    like_url: boolean;
    like_num: boolean;
    like_email: boolean;
    is_oov: boolean;
    is_stop: boolean;
    pos: string;
    tag: string;
    dep: string;
    lang: string;
    prob: number;
    idx: number;
    sentiment: number;
    lex_id: number;
    rank: number;
    cluster: number;
    position_start_text: number;
    position_end_text: number;
}

export interface Sent {
    start: number;
    end: number;
}

export interface Doc {
    text: string;
    text_with_ws: string;
    cats: Cats;
    is_tagged: boolean;
    is_parsed: boolean;
    is_sentenced: boolean;
}

export interface Cats {
}