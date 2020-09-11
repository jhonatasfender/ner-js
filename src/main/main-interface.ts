
export interface SpacyParse {
    model: string;
    doc: Doc;
    ents: Entity[];
    sents: Sent[];
    noun_chunks: any[];
    tokens: Token[];
}

export interface Entity {
    start: number,
    end: number,
    label: string,
    text: string,
}

export interface Token {
    sent: Sent;
    tensor: string[];
    text: string;
    text_with_ws: string;
    whitespace: string;
    orth: string;
    head: Head;
    left_edge: Head;
    right_edge: Head;
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

export interface Head {
    sent: Sent;
    tensor: string[];
    text: string;
    text_with_ws: string;
    whitespace: string;
    orth: string;
    head: Cats;
    left_edge: Cats;
    right_edge: Cats;
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