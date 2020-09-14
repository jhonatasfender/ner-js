# coding: utf8
from __future__ import unicode_literals

import json
import random

import hug
import plac
import spacy
import waitress
from hug_middleware_cors import CORSMiddleware
from numpyencoder import NumpyEncoder

MODELS = {}


@plac.annotations(
    models=("Comma-separated list of spaCy models", "positional", None, str),
    host=("Host to serve API", "option", "ho", str),
    port=("Port to serve API", "option", "p", int),
)
def main(models=None, host="0.0.0.0", port=8080):
    if not models:
        models = ["en_core_web_sm"]
    else:
        models = [m.strip() for m in models.split(",")]
    for model in models:
        load_model(model)
    # Serving Hug API
    app = hug.API(__name__)
    app.http.add_middleware(CORSMiddleware(app))
    waitress.serve(__hug_wsgi__, port=port)


def load_model(model):
    print("Loading model '{}'...".format(model))
    MODELS[model] = spacy.load(model)


def docToDict(token: spacy.tokens.Token, again: bool = True, unique: int = 0):
    try:
        return {
            "id": unique,
            "sent": {
                "start": token.sent.start,
                "end": token.sent.end
            },
            "tensor": [str(tensor) for tensor in token.tensor],
            "text": token.text,
            "text_with_ws": token.text_with_ws,
            "whitespace": token.whitespace_,
            "orth": token.orth,
            "orth": token.orth_,
            "head": docToDict(token.head, False) if again else {},
            "left_edge":  docToDict(token.left_edge, False) if again else {},
            "right_edge": docToDict(token.right_edge, False) if again else {},
            "i": token.i,
            "ent_type": token.ent_type,
            "ent_type": token.ent_type_,
            "ent_iob": token.ent_iob,
            "ent_iob": token.ent_iob_,
            "ent_kb_id": token.ent_kb_id,
            "ent_kb_id_": token.ent_kb_id_,
            "ent_id": token.ent_id,
            "ent_id": token.ent_id_,
            "lemma": token.lemma,
            "lemma": token.lemma_,
            "norm": token.norm,
            "norm": token.norm_,
            "lower": token.lower,
            "lower": token.lower_,
            "shape": token.shape,
            "shape": token.shape_,
            "prefix": token.prefix,
            "prefix": token.prefix_,
            "suffix": token.suffix,
            "suffix": token.suffix_,
            "is_alpha": token.is_alpha,
            "is_ascii": token.is_ascii,
            "is_digit": token.is_digit,
            "is_lower": token.is_lower,
            "is_upper": token.is_upper,
            "is_title": token.is_title,
            "is_punct": token.is_punct,
            "is_left_punct": token.is_left_punct,
            "is_right_punct": token.is_right_punct,
            "is_space": token.is_space,
            "is_bracket": token.is_bracket,
            "is_quote": token.is_quote,
            "is_currency": token.is_currency,
            "like_url": token.like_url,
            "like_num": token.like_num,
            "like_email": token.like_email,
            "is_oov": token.is_oov,
            "is_stop": token.is_stop,
            "pos": token.pos,
            "pos": token.pos_,
            "tag": token.tag,
            "tag": token.tag_,
            "dep": token.dep,
            "dep": token.dep_,
            "lang": token.lang,
            "lang": token.lang_,
            "prob": token.prob,
            "idx": token.idx,
            "sentiment": token.sentiment,
            "lex_id": token.lex_id,
            "rank": token.rank,
            "cluster": token.cluster,
            "position_start_text": token.idx,
            "position_end_text": token.idx+len(token.text)-1
        }
    except:
        return {}


def uniqueid():
    seed = random.getrandbits(32)
    while True:
        yield seed
        seed += 1


def entity(ent: spacy.tokens.span.Span, id: int):
    return {
        "id": id,
        "start": ent.start,
        "end": ent.end,
        "label": ent.label_,
        "text": ent.text,
        #######################
        "conjuncts": ent.conjuncts,
        "end": ent.end,
        "end_char": ent.end_char,
        "ent_id": ent.ent_id,
        "ent_id_": ent.ent_id_,
        "ents": ent.ents,
        "kb_id": ent.kb_id,
        "kb_id_": ent.kb_id_,
        "label_number": ent.label,
        "label_": ent.label_,
        "lemma_": ent.lemma_,
        "lower_": ent.lower_,
        "n_lefts": ent.n_lefts,
        "n_rights": ent.n_rights,
        "orth_": ent.orth_,
        "root": docToDict(ent.root),
        "sentiment": ent.sentiment,
        "start": ent.start,
        "start_char": ent.start_char,
        "string": ent.string,
        "text": ent.text,
        "text_with_ws": ent.text_with_ws,
        "upper_": ent.upper_,
    }


def doc2json(doc: spacy.tokens.Doc, model: str):
    json_doc = {
        "text": doc.text,
        "text_with_ws": doc.text_with_ws,
        "cats": doc.cats,
        "is_tagged": doc.is_tagged,
        "is_parsed": doc.is_parsed,
        # "is_nered": doc.is_nered,
        "is_sentenced": doc.is_sentenced,
    }

    unique_sequence = uniqueid()

    ents = [
        entity(ent, next(unique_sequence)) for ent in doc.ents
    ]

    if doc.is_sentenced:
        sents = [{"start": sent.start, "end": sent.end} for sent in doc.sents]
    else:
        sents = []
    if doc.is_tagged and doc.is_parsed:
        noun_chunks = [
            {"start": chunk.start, "end": chunk.end} for chunk in doc.noun_chunks
        ]
    else:
        noun_chunks = []

    unique_token = uniqueid()
    tokens = [docToDict(token, unique=next(unique_token)) for token in doc]
    return {
        "model": model,
        "doc": json_doc,
        "ents": ents,
        "sents": sents,
        "noun_chunks": noun_chunks,
        "tokens": tokens,
    }


@hug.post("/parse")
def parse(model: str, text: str):
    nlp = MODELS[model]
    doc = nlp(text)
    return doc2json(doc, model)


@hug.post("/similarity")
def similarity(model: str, text1: str, text2: str):
    # We can always create Doc objects here, because the result is the same
    nlp = MODELS[model]
    doc1 = nlp(text1)
    doc2 = nlp(text2)
    return {"similarity": doc1.similarity(doc2)}


if __name__ == "__main__":
    plac.call(main)
